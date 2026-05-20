import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import StatusWrapper from "@/components/layout/StatusWrapper";
import JobCreateButton from "@/containers/buttons/JobCreateButton";
import JobList, { type IJobListProps } from "@/containers/lists/JobList";
import { jobListRequestSchema } from "@/store/schemas/jobs";
import type { TRouteLoaderData } from "@/store/types/router";

const paramsSchema = jobListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/board/jobs/")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  pendingComponent: () => <StatusWrapper loading my={2} />,
  errorComponent: ({ error }) => <StatusWrapper error={error} my={2} />,
  component: RouteComponent,
  loader: (): TRouteLoaderData => ({
    slotProps: {
      pageHeader: { endContent: <JobCreateButton variant="text" /> },
    },
  }),
});

function RouteComponent() {
  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Callbacks */

  const handleOnParamsChange: IJobListProps["onParamsChange"] = (newParams) =>
    navigate({
      to: ".",
      search: paramsSchema.parse(newParams),
      replace: true,
    });

  return <JobList params={params} onParamsChange={handleOnParamsChange} />;
}
