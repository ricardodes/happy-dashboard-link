import { createFileRoute, redirect, Outlet, isRedirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  // Desabilitando autenticação temporariamente conforme solicitado
  component: () => <Outlet />,
});
