CREATE TABLE public.child_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  birth_year integer,
  grade_level text,
  reading_level text NOT NULL DEFAULT 'emerging',
  preferred_language text NOT NULL DEFAULT 'en',
  interests text[] NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.child_profiles TO authenticated;
GRANT ALL ON public.child_profiles TO service_role;

ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their child profiles" ON public.child_profiles
  FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners can create child profiles" ON public.child_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their child profiles" ON public.child_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can delete their child profiles" ON public.child_profiles
  FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE TRIGGER update_child_profiles_updated_at
  BEFORE UPDATE ON public.child_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX child_profiles_owner_id_idx ON public.child_profiles (owner_id);