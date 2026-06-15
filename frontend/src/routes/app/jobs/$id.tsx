import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container } from "@mui/material";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import { jobEndpoints, JobIcons } from "@/store/constants/jobs";
import { errorUtils } from "@/store/utils/error";
import { idSchema } from "@/store/schemas/basic";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/jobs/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const id = idSchema.parse(params.id);
      const job = await context.queryClient.fetchQuery({
        queryKey: jobEndpoints.job(id).id,
        queryFn: jobEndpoints.job(id).get,
      });
      return { job };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  loader: ({ context: { job } }): TRouteLoaderData => ({
    crumb: {
      label: `Job ${job.id}`,
      Icon: JobIcons.Detail,
    },
  }),
  notFoundComponent: () => (
    <Container>
      <PageNotFoundCard my={2} />
    </Container>
  ),
});
