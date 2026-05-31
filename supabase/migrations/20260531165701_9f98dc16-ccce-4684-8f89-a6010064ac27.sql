
-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Updated-at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ CLIENTS ============
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  document TEXT,
  segment TEXT,
  monthly_fee NUMERIC(12,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ativo',
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read clients" ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update clients" ON public.clients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth delete clients" ON public.clients FOR DELETE TO authenticated USING (true);
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ TRANSACTIONS ============
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_on DATE NOT NULL DEFAULT CURRENT_DATE,
  kind TEXT NOT NULL CHECK (kind IN ('receita','despesa')),
  amount NUMERIC(12,2) NOT NULL,
  category TEXT,
  description TEXT,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read tx" ON public.transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth ins tx" ON public.transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth upd tx" ON public.transactions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth del tx" ON public.transactions FOR DELETE TO authenticated USING (true);
CREATE TRIGGER trg_tx_updated BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_tx_date ON public.transactions(occurred_on DESC);

-- ============ LEADS ============
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  source TEXT,
  stage TEXT NOT NULL DEFAULT 'novo',
  potential_value NUMERIC(12,2) DEFAULT 0,
  next_action TEXT,
  next_action_at DATE,
  notes TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read leads" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth ins leads" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth upd leads" ON public.leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth del leads" ON public.leads FOR DELETE TO authenticated USING (true);
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ APPOINTMENTS ============
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  kind TEXT DEFAULT 'reuniao',
  status TEXT NOT NULL DEFAULT 'agendado',
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read appt" ON public.appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth ins appt" ON public.appointments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth upd appt" ON public.appointments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth del appt" ON public.appointments FOR DELETE TO authenticated USING (true);
CREATE TRIGGER trg_appt_updated BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_appt_starts ON public.appointments(starts_at);

-- ============ TASKS ============
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  due_on DATE,
  status TEXT NOT NULL DEFAULT 'aberta',
  priority TEXT NOT NULL DEFAULT 'media',
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  description TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read tasks" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth ins tasks" ON public.tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth upd tasks" ON public.tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth del tasks" ON public.tasks FOR DELETE TO authenticated USING (true);
CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ MARKETING POSTS ============
CREATE TABLE public.marketing_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'instagram',
  content TEXT,
  image_url TEXT,
  image_prompt TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho',
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_posts TO authenticated;
GRANT ALL ON public.marketing_posts TO service_role;
ALTER TABLE public.marketing_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read mkt" ON public.marketing_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth ins mkt" ON public.marketing_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth upd mkt" ON public.marketing_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth del mkt" ON public.marketing_posts FOR DELETE TO authenticated USING (true);
CREATE TRIGGER trg_mkt_updated BEFORE UPDATE ON public.marketing_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ADMIN USER (admin@admin.com / admin123) ============
DO $$
DECLARE
  uid UUID := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@admin.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, recovery_sent_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      'admin@admin.com', crypt('admin123', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{"name":"Admin Nobel"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), uid, format('{"sub":"%s","email":"%s"}', uid, 'admin@admin.com')::jsonb, 'email', uid::text, now(), now(), now());
  END IF;
END $$;
