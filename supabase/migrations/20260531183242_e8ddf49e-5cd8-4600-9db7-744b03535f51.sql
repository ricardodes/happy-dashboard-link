
-- Remove hardcoded admin credentials
DELETE FROM auth.identities WHERE provider_id = (SELECT id::text FROM auth.users WHERE email = 'admin@admin.com');
DELETE FROM auth.users WHERE email = 'admin@admin.com';

-- Tighten RLS policies: replace USING(true) with auth.uid() IS NOT NULL
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname, cmd
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('clients','transactions','leads','appointments','tasks','marketing_posts')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Recreate as authenticated-only with explicit auth.uid() check
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['clients','transactions','leads','appointments','tasks','marketing_posts']
  LOOP
    EXECUTE format('CREATE POLICY "auth_select" ON public.%I FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL)', t);
    EXECUTE format('CREATE POLICY "auth_insert" ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL)', t);
    EXECUTE format('CREATE POLICY "auth_update" ON public.%I FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL)', t);
    EXECUTE format('CREATE POLICY "auth_delete" ON public.%I FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL)', t);
  END LOOP;
END $$;
