import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container } from "@mui/material";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import { JobIcons } from "@/store/constants/jobs";
import jobEndpoints from "@/store/endpoints/jobs";
import { errorUtils } from "@/store/utils/error";
import { idSchema } from "@/store/schemas/basic";

export const Route = createFileRoute("/app/jobs/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const id = idSchema.parse(params.id);
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
      <PageNotFoundCard my={2} />
    </Container>
  ),
});
