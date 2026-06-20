import { createFileRoute } from "@tanstack/react-router";
import { JobIcons } from "@/store/constants/jobs";

export const Route = createFileRoute("/app/jobs")({
  beforeLoad: () => ({ crumb: { label: "Jobs", Icon: JobIcons.List } }),
});
