import { type ComponentProps } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ClientList from "@/containers/lists/ClientList";
import { clientApi } from "@/store/api/clients";

export const Route = createFileRoute("/app/clients/")({
  validateSearch: (
    search: Record<string, unknown>
  ): Parameters<typeof clientApi.list>[0] => ({
    page: search?.page ? Number(search.page) : undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Callbacks */

  const onPageChange: ComponentProps<typeof ClientList>["onPageChange"] = (
    page
  ) => navigate({ to: "/app/clients", search: { ...params, page } });

  return <ClientList params={params} onPageChange={onPageChange} />;
}
