import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container } from "@mui/material";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import { JobIcons } from "@/store/constants/jobs";
import jobEndpoints from "@/store/endpoints/jobs";
import { errorUtils } from "@/store/utils/error";

export const Route = createFileRoute("/app/jobs/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const job = await context.queryClient.fetchQuery({
        queryKey: jobEndpoints.job(params.id).id,
        queryFn: jobEndpoints.job(params.id).get,
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
      <PageNotFoundCard my={2} />
    </Container>
  ),
});
