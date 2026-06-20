import { createFileRoute } from "@tanstack/react-router";
import { PlaceIcons } from "@/store/constants/places";

export const Route = createFileRoute("/app/places")({
  beforeLoad: () => ({ crumb: { label: "Places", Icon: PlaceIcons.List } }),
});
