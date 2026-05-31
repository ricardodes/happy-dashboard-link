import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  // Autenticação removida permanentemente. Agora esta é apenas um wrapper de layout.
  component: () => <Outlet />,
});
