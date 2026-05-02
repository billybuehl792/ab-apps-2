import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Box } from "@mui/material";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import JobCreateButton from "@/containers/buttons/JobCreateButton";
import JobGrid from "@/containers/tables/JobGrid";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { jobEndpoints } from "@/store/constants/jobs";
import { jobListRequestSchema } from "@/store/schemas/jobs";
import type { TRouteLoaderData } from "@/store/types/router";
import type { TJob, TJobListRequest } from "@/store/types/jobs";

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

  /** Queries */

  const jobListQuery = useQuery({
    queryKey: [jobEndpoints.id, params],
    queryFn: () => jobEndpoints.get({ params }),
    placeholderData: keepPreviousData,
  });

  /** Callbacks */

  const handleOnParamsChange = (newParams: TJobListRequest["params"]) =>
    navigate({
      to: ".",
      search: paramsSchema.parse(newParams),
      replace: true,
    });

  return (
    <Box sx={{ height: 500, my: 2 }}>
      <JobGrid
        rows={jobListQuery.data?.results ?? []}
        rowCount={jobListQuery.data?.count ?? 0}
        loading={jobListQuery.isFetching}
        params={params}
        showToolbar
        onParamsChange={handleOnParamsChange}
      />
    </Box>
  );
}
