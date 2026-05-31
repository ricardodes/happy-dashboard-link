-- Add columns to clients
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS alterdata_id TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS additional_info JSONB DEFAULT '{}'::jsonb;

-- Fiscal Dates table
CREATE TABLE IF NOT EXISTS public.fiscal_dates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    due_at TIMESTAMP WITH TIME ZONE NOT NULL,
    category TEXT DEFAULT 'federal', -- federal, estadual, municipal
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fiscal_dates TO authenticated;
GRANT ALL ON public.fiscal_dates TO service_role;
ALTER TABLE public.fiscal_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for now" ON public.fiscal_dates FOR ALL USING (true);

-- External Leads (Harvested from Google/Maps)
CREATE TABLE IF NOT EXISTS public.external_leads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    phone TEXT,
    website TEXT,
    rating NUMERIC,
    category TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.external_leads TO authenticated;
GRANT ALL ON public.external_leads TO service_role;
ALTER TABLE public.external_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for now" ON public.external_leads FOR ALL USING (true);

-- Insert some default fiscal dates for June 2026
INSERT INTO public.fiscal_dates (title, description, due_at, category) VALUES
('FGTS', 'Prazo para recolhimento do FGTS mensal.', '2026-06-07 23:59:59+00', 'federal'),
('eSocial', 'Fechamento da folha de pagamento no eSocial.', '2026-06-07 23:59:59+00', 'federal'),
('Simples Nacional', 'Pagamento do DAS do Simples Nacional.', '2026-06-20 23:59:59+00', 'federal'),
('PIS/COFINS', 'Recolhimento de PIS/COFINS sobre faturamento.', '2026-06-25 23:59:59+00', 'federal');
