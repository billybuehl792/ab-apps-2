import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mui/material";
import ListCard from "@/components/cards/ListCard";
import { jobEndpoints, JobIcons } from "@/store/constants/jobs";

export const Route = createFileRoute("/app/board/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Queries */

  const jobListQuery = useQuery({
    queryKey: jobEndpoints.id,
    queryFn: () => jobEndpoints.get(),
  });

  return (
    <Stack spacing={1} my={2}>
      <ListCard
        startContent={<JobIcons.List fontSize="large" color="disabled" />}
        label="Jobs"
        description={`Total: ${jobListQuery.data?.count ?? "-"}`}
      />
    </Stack>
  );
}
