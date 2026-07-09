import { createFileRoute } from "@tanstack/react-router";
import { JobIcons } from "@/store/constants/jobs";
import Breadcrumb from "@/components/links/Breadcrumb";

export const Route = createFileRoute("/app/jobs")({
  staticData: {
    crumb: {
      id: "/app/jobs",
      Component: () => (
        <Breadcrumb
          to="/app/jobs"
          children="Jobs"
          startIcon={<JobIcons.List />}
        />
      ),
    },
  },
});
