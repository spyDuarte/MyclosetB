-- Initial schema for wardrobe management domain
-- Creates tables, constraints, triggers, RLS policies, and helper RPC functions.

-- Enable UUID generation helpers
create extension if not exists "uuid-ossp";

-- Profiles are 1:1 with auth.users
create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    username text unique,
    full_name text,
    avatar_url text,
    role text not null default 'user' check (role in ('user', 'stylist', 'admin')),
    preferences jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.profiles is 'End-user profile metadata mapped 1:1 with auth.users.';

create table if not exists public.categories (
    id uuid primary key default uuid_generate_v4(),
    slug text not null unique,
    name text not null,
    description text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.categories is 'Taxonomy for clothing items (e.g., tops, bottoms, accessories).';

create table if not exists public.items (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid not null references public.profiles (id) on delete cascade,
    category_id uuid references public.categories (id),
    name text not null,
    description text,
    color text,
    size text,
    brand text,
    image_url text,
    care_instructions text,
    purchase_date date,
    season text,
    formality text,
    is_active boolean not null default true,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.items is 'Individual wardrobe items belonging to a profile.';

create table if not exists public.outfits (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid not null references public.profiles (id) on delete cascade,
    name text not null,
    description text,
    season text,
    formality text,
    image_url text,
    item_ids uuid[] not null default array[]::uuid[],
    tags text[] not null default array[]::text[],
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.outfits is 'Curated outfits assembled from one or more wardrobe items.';

create table if not exists public.events (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid not null references public.profiles (id) on delete cascade,
    name text not null,
    description text,
    event_date date not null,
    start_time timestamptz,
    location text,
    dress_code text,
    season text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.events is 'Calendar events that can be used to plan outfits.';

-- Generic trigger to maintain updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at := timezone('utc', now());
    return new;
end;
$$;

create trigger set_timestamp
    before update on public.profiles
    for each row
    execute procedure public.set_updated_at();

create trigger set_timestamp
    before update on public.categories
    for each row
    execute procedure public.set_updated_at();

create trigger set_timestamp
    before update on public.items
    for each row
    execute procedure public.set_updated_at();

create trigger set_timestamp
    before update on public.outfits
    for each row
    execute procedure public.set_updated_at();

create trigger set_timestamp
    before update on public.events
    for each row
    execute procedure public.set_updated_at();

-- Helper to maintain profile rows for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, full_name, avatar_url, preferences)
    values (new.id,
            coalesce(new.raw_user_meta_data->>'full_name', ''),
            new.raw_user_meta_data->>'avatar_url',
            coalesce(nullif(new.raw_user_meta_data->>'preferences', ''), '{}')::jsonb)
    on conflict (id) do update
        set full_name = excluded.full_name,
            avatar_url = excluded.avatar_url,
            updated_at = timezone('utc', now());
    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Row Level Security configuration
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.items enable row level security;
alter table public.outfits enable row level security;
alter table public.events enable row level security;

-- Profiles policies
create policy "Profiles are readable by the owner"
    on public.profiles for select
    using (id = auth.uid());

create policy "Profiles are updatable by the owner"
    on public.profiles for update
    using (id = auth.uid())
    with check (id = auth.uid());

-- Categories policies
create policy "Categories are publicly readable"
    on public.categories for select
    using (true);

create policy "Categories manageable by admins"
    on public.categories for all
    using (coalesce(auth.jwt() ->> 'role', '') = 'admin')
    with check (coalesce(auth.jwt() ->> 'role', '') = 'admin');

-- Items policies
create policy "Items owned by the requesting user"
    on public.items for all
    using (profile_id = auth.uid())
    with check (profile_id = auth.uid());

-- Outfits policies
create policy "Outfits owned by the requesting user"
    on public.outfits for all
    using (profile_id = auth.uid())
    with check (profile_id = auth.uid());

-- Events policies
create policy "Events owned by the requesting user"
    on public.events for all
    using (profile_id = auth.uid())
    with check (profile_id = auth.uid());

-- Helper to ensure only related item ids are stored with outfits
create or replace function public.validate_outfit_items()
returns trigger
language plpgsql
as $$
declare
    invalid_count integer;
begin
    if new.item_ids is null or cardinality(new.item_ids) = 0 then
        return new;
    end if;

    select count(*)
    into invalid_count
    from unnest(new.item_ids) as iid
    where not exists (
        select 1
        from public.items it
        where it.id = iid
          and it.profile_id = new.profile_id
    );

    if invalid_count > 0 then
        raise exception 'Outfit references items that do not belong to the profile';
    end if;

    return new;
end;
$$;

create trigger ensure_outfit_items_valid
    before insert or update on public.outfits
    for each row execute procedure public.validate_outfit_items();

-- RPC to suggest outfits for a given event
create or replace function public.suggest_outfits(p_event_id uuid, p_limit integer default 3)
returns table (
    outfit_id uuid,
    outfit_name text,
    suitability_score numeric,
    matched_season boolean,
    matched_formality boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
    target_event public.events;
begin
    select * into target_event
    from public.events
    where id = p_event_id
      and profile_id = auth.uid();

    if not found then
        raise exception 'Event not found or access denied';
    end if;

    return query
    select
        o.id as outfit_id,
        o.name as outfit_name,
        round(
            coalesce((case when target_event.season is not null and o.season = target_event.season then 0.35 else 0 end), 0) +
            coalesce((case when target_event.dress_code is not null and o.formality = target_event.dress_code then 0.35 else 0 end), 0) +
            coalesce(item_match.avg_season_match * 0.15, 0) +
            coalesce(item_match.avg_formality_match * 0.15, 0)
        , 2) as suitability_score,
        (target_event.season is not null and o.season = target_event.season) as matched_season,
        (target_event.dress_code is not null and o.formality = target_event.dress_code) as matched_formality
    from public.outfits o
    left join lateral (
        select
            avg(case when i.season is not null and target_event.season is not null and i.season = target_event.season then 1 else 0 end) as avg_season_match,
            avg(case when i.formality is not null and target_event.dress_code is not null and i.formality = target_event.dress_code then 1 else 0 end) as avg_formality_match
        from public.items i
        where i.id = any(o.item_ids)
          and i.profile_id = o.profile_id
    ) as item_match on true
    where o.profile_id = target_event.profile_id
    order by suitability_score desc, o.created_at desc
    limit least(coalesce(p_limit, 3), 20);
end;
$$;

grant execute on function public.suggest_outfits(uuid, integer) to authenticated;

-- Helper RPC to upsert category slugs from name when not provided
create or replace function public.ensure_category_slug()
returns trigger
language plpgsql
as $$
begin
    if new.slug is null or new.slug = '' then
        new.slug := replace(lower(new.name), ' ', '-');
    end if;
    return new;
end;
$$;

create trigger ensure_category_slug
    before insert or update on public.categories
    for each row execute procedure public.ensure_category_slug();

-- Grant minimal privileges
revoke all on public.profiles from public;
revoke all on public.categories from public;
revoke all on public.items from public;
revoke all on public.outfits from public;
revoke all on public.events from public;

grant select, insert, update, delete on public.items to authenticated;
grant select, insert, update, delete on public.outfits to authenticated;
grant select, insert, update, delete on public.events to authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.categories to anon;
grant select on public.categories to authenticated;
