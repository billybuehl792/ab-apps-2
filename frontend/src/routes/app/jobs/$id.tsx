import { createFileRoute, notFound } from "@tanstack/react-router";
import { jobEndpoints, JobIcons } from "@/store/constants/jobs";
import { errorUtils } from "@/store/utils/error";
import { idSchema } from "@/store/schemas/basic";
import type { TRouteLoaderData } from "@/store/types/router";
import type { TJob } from "@/store/types/jobs";

export const Route = createFileRoute("/app/jobs/$id")({
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
          label: job.label || "Untitled",
          Icon: JobIcons.Detail,
        },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
});
