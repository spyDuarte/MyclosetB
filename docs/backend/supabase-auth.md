# Supabase authentication & authorization

This project relies on Supabase Auth for passwordless email login and social sign-in. The SQL schema under `supabase/migrations/` wires
profile data, row level security (RLS), and role-based access control for privileged operations (for example managing global
categories).

## Supported authentication flows

| Flow | Notes |
| ---- | ----- |
| Email sign-up / sign-in | Enabled by default in Supabase projects. Users receive a verification email before the session becomes active. |
| OAuth providers | Google, GitHub, Apple, Facebook, and other providers can be toggled from **Auth → Providers** in the Supabase dashboard. |

When a user authenticates, Supabase emits a JWT that includes:

- `sub` / `aud` – standard claims describing the user identifier and audience.
- `exp` / `iat` – expiry and issued-at timestamps.
- `role` – custom claim sourced from `app_metadata.role` (see below). This claim powers the RLS policy that grants admin access to the
  `categories` table.
- `email` – for email-based flows.

## Profile provisioning

The migration installs a trigger `on_auth_user_created` that calls `public.handle_new_user`. The trigger ensures a row exists in
`public.profiles` for every authenticated user. You can supply optional defaults (full name, avatar URL, preferences) by setting
`raw_user_meta_data` when registering users through the Supabase Admin API.

Profiles are linked 1:1 with `auth.users.id` and store a `role` column with the following enum-style contract:

- `user` (default)
- `stylist`
- `admin`

The JWT `role` claim is expected to stay in sync with this column for administrative actions. Use the [Supabase Admin API](https://supabase.com/docs/reference/javascript/auth-admin-updateuserbyid)
(or the dashboard) to set `app_metadata.role`. Example:

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
await supabase.auth.admin.updateUserById(userId, {
  app_metadata: { role: 'admin' },
});
```

## Authorization & RLS

Row level security is enabled for every table created in the initial migration. Policies reference `auth.uid()` and the JWT `role`
claim. Highlights:

- `profiles`: users can read and update their own record only.
- `items`, `outfits`, `events`: full CRUD is permitted when the `profile_id` matches `auth.uid()`.
- `categories`: read access is granted to both anonymous and authenticated sessions, but insert/update/delete requires an `admin`
  role in the JWT.
- `suggest_outfits` RPC: callable by authenticated users only. The function validates event ownership before returning suggested
  outfits.

The default grants at the bottom of the migration align with Supabase’s built-in roles:

- `anon` receives read-only access to `categories` (useful for public landing pages).
- `authenticated` receives CRUD permissions subject to the RLS policies above.

## Testing locally

1. Start the Supabase stack (Docker) and apply migrations:
   ```bash
   supabase start
   supabase db reset
   ```
2. Execute smoke tests that confirm tables, RLS, and RPC registration:
   ```bash
   supabase db execute --file supabase/tests/schema_validation.sql
   ```
3. Create a test user and set role metadata:
   ```bash
   supabase auth signups create --email user@example.com --password SupaSafe123
   supabase auth admin update user --email user@example.com --data '{"role": "admin"}'
   ```
4. Test the `suggest_outfits` RPC from the SQL editor or using the JavaScript client:
   ```ts
   const { data, error } = await supabase.rpc('suggest_outfits', { p_event_id, p_limit: 5 });
   ```

Refer to `supabase/tests/` for additional scripts that can be executed via the Supabase CLI.
