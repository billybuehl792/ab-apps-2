import { createFileRoute } from "@tanstack/react-router";
import { JobIcons } from "@/store/constants/jobs";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/board/jobs")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Jobs", Icon: JobIcons.List },
  }),
});
