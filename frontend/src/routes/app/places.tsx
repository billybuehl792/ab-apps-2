import { createFileRoute } from "@tanstack/react-router";
import { PlaceIcons } from "@/store/constants/places";
import Breadcrumb from "@/components/links/Breadcrumb";

export const Route = createFileRoute("/app/places")({
  staticData: {
    crumb: {
      id: "/app/places",
      Component: () => (
        <Breadcrumb
          to="/app/places"
          children="Places"
          startIcon={<PlaceIcons.List />}
        />
      ),
    },
  },
});
