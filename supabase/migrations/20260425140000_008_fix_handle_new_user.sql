-- K-AUTH-001 / D-011: handle_new_user() leste ikke raw_user_meta_data,
-- så full_name fra signUp({ options: { data: { full_name } } }) gikk tapt.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'kunde'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Trigger on_auth_user_created uendret — peker fortsatt på handle_new_user().
