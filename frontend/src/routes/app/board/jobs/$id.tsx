import { createFileRoute, notFound } from "@tanstack/react-router";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { jobEndpoints, JobIcons } from "@/store/constants/jobs";
import { errorUtils } from "@/store/utils/error";
import { idSchema } from "@/store/schemas/basic";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/board/jobs/$id")({
  loader: async ({ context, params }): Promise<TRouteLoaderData<TJob>> => {
    try {
      const jobId = idSchema.parse(params.id);
      const job = await context.queryClient.fetchQuery({
        queryKey: jobEndpoints.job(jobId).id,
        queryFn: jobEndpoints.job(jobId).get,
      });

      return {
        data: job,
        crumb: {
          label: job.label || `Job ${job.id}`,
          Icon: JobIcons.Detail,
        },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  pendingComponent: () => <StatusWrapper loading="Loading Job..." my={2} />,
  errorComponent: ({ error }) => <StatusWrapper error={error} my={2} />,
  notFoundComponent: () => <PageNotFoundCard my={2} />,
});
