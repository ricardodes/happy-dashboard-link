import { createFileRoute, redirect, Outlet, isRedirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        throw redirect({
          to: "/login",
          search: { redirect: location.href },
        });
      }
    } catch (e) {
      if (isRedirect(e)) throw e;
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: () => <Outlet />,
});
