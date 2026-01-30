-- ROBUST FIX for handle_new_user
-- 1. Wraps logic in EXCEPTION block to prevent blocking User Signups/Logins
-- 2. Uses ON CONFLICT to prevent duplicate key errors
-- 3. Ensures the Trigger is properly attached

-- Define the function with safety features
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email, username)
  values (
    new.id,
    -- prioritized list of name sources, fallback to email local part, then 'Anonymous'
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'user_name',
      split_part(new.email, '@', 1),
      'Anonymous'
    ),
    new.raw_user_meta_data->>'avatar_url',
    new.email,
    -- Try to set username to email to satisfy potential constraints, but proceed if it fails
    new.email
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    email = excluded.email;
    
  return new;
exception
  when others then
    -- Catch ANY error so we don't block the User from logging in
    -- Log it to Supabase Postgres logs
    raise warning 'handle_new_user failed for %: %', new.id, SQLERRM;
    return new;
end;
$$;

-- Ensure the trigger exists
-- We drop it first to ensure we don't have duplicates or mismatched names
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
