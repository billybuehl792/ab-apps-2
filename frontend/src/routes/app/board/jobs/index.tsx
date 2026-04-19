import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mui/material";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import JobCreateButton from "@/containers/buttons/JobCreateButton";
import JobTable from "@/containers/tables/JobTable";
import StatusWrapper from "@/components/layout/StatusWrapper";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import { jobEndpoints } from "@/store/constants/jobs";
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
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Queries */

  const jobListQuery = useQuery({
    queryKey: [jobEndpoints.id, { params }],
    queryFn: () => jobEndpoints.get({ params }),
  });

  /** Callbacks */

  const handleOnParamsChange = (
    newParams: z.input<typeof jobListRequestSchema.shape.params>,
  ) =>
    navigate({
      to: ".",
      search: jobListRequestSchema.shape.params.parse(newParams),
      replace: true,
    });

  return (
    <Stack spacing={2} my={2}>
      <DebouncedSearchField
        value={params.search ?? ""}
        size="small"
        onChange={(value) =>
          handleOnParamsChange({ ...params, page: 1, search: value })
        }
      />
      <JobTable
        rows={jobListQuery.data?.results ?? []}
        page={params.page}
        ordering={params.ordering}
        count={jobListQuery.isSuccess ? jobListQuery.data?.count : -1}
        loading={jobListQuery.isLoading}
        rowsPerPage={params.page_size}
        rowsPerPageOptions={[1, 10, 20, 100]}
        onPageChange={(_event, page) =>
          handleOnParamsChange({ ...params, page })
        }
        onOrderingChange={(ordering) =>
          handleOnParamsChange({ ...params, page: 1, ordering })
        }
        onRowsPerPageChange={(event) =>
          handleOnParamsChange({
            ...params,
            page: 1,
            page_size: parseInt(event.target.value, 10),
          })
        }
      />
    </Stack>
  );
}
