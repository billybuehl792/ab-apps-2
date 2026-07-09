import { createFileRoute } from "@tanstack/react-router";
import { ContactIcons } from "@/store/constants/contacts";
import Breadcrumb from "@/components/links/Breadcrumb";

export const Route = createFileRoute("/app/contacts")({
  staticData: {
    crumb: {
      id: "/app/contacts",
      Component: () => (
        <Breadcrumb
          to="/app/contacts"
          children="Contacts"
          startIcon={<ContactIcons.List />}
        />
      ),
    },
  },
});
