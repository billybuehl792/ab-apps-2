import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container } from "@mui/material";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import { JobIcons } from "@/store/constants/jobs";
import jobEndpoints from "@/store/endpoints/jobs";
import { errorUtils } from "@/store/utils/error";

export const Route = createFileRoute("/app/jobs/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const id = Number(params.id);
      if (isNaN(id)) throw new Error("Invalid job ID");

      const job = await context.queryClient.fetchQuery({
        queryKey: jobEndpoints.job(id).id,
        queryFn: jobEndpoints.job(id).get,
      });

      return {
        job,
        crumb: { label: `Job ${job.id}`, Icon: JobIcons.Detail },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  notFoundComponent: () => (
    <Container>
      <PageNotFoundCard
        label="Job not found"
        description="The job you are looking for does not exist or has been removed."
        my={2}
      />
    </Container>
  ),
});
