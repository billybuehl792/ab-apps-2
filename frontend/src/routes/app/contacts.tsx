import { createFileRoute } from "@tanstack/react-router";
import { ContactIcons } from "@/store/constants/contacts";

export const Route = createFileRoute("/app/contacts")({
  beforeLoad: () => ({ crumb: { label: "Contacts", Icon: ContactIcons.List } }),
});
