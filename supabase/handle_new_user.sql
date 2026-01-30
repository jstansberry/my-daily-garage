-- Create or replace the function to handle new user signups
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  -- Variable to hold the display name we find
  display_name text;
begin
  -- Priority order for finding a name:
  -- 1. full_name (Standard OAuth field)
  -- 2. name (Often used by Discord/GitHub)
  -- 3. custom_claims -> global_name (Discord specific)
  -- 4. user_name (Sometimes present)
  -- 5. preferred_username (OIDC standard)
  -- 6. email (Fallback, taking the part before @)
  
  display_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'global_name',
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'preferred_username',
    split_part(new.email, '@', 1)
  );

  -- Insert the new profile
  insert into public.profiles (id, full_name, username, avatar_url, email)
  values (
    new.id,
    display_name,
    display_name, -- Use same name for username initially
    new.raw_user_meta_data->>'avatar_url',
    new.email
  );

  return new;
end;
$$;
