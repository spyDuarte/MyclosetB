-- Basic smoke tests for the Supabase schema.
-- Execute with: supabase db execute --file supabase/tests/schema_validation.sql

-- Verify tables exist
select 'profiles table', to_regclass('public.profiles');
select 'categories table', to_regclass('public.categories');
select 'items table', to_regclass('public.items');
select 'outfits table', to_regclass('public.outfits');
select 'events table', to_regclass('public.events');

-- Verify RLS is enabled
select relname as table_name, relrowsecurity
from pg_class
where relname in ('profiles', 'categories', 'items', 'outfits', 'events')
order by relname;

-- Verify suggest_outfits RPC signature
select
    proname,
    pg_get_function_result(p.oid) as result_type,
    pg_get_function_arguments(p.oid) as arguments,
    prosecdef as security_definer
from pg_proc p
join pg_namespace n on p.pronamespace = n.oid
where n.nspname = 'public'
  and proname = 'suggest_outfits';
