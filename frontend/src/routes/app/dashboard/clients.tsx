import { createFileRoute } from "@tanstack/react-router";
import { CLIENTS_ICON } from "@/store/constants/clients";

export const Route = createFileRoute("/app/dashboard/clients")({
  loader: () => {
    const crumb: Crumb = { label: "Clients", Icon: CLIENTS_ICON };
    return { crumb };
  },
});
