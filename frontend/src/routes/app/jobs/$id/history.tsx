import {
  createFileRoute,
  stripSearchParams,
  useLoaderData,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@mui/material";
import { z } from "zod";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import HistoryList from "@/containers/lists/HistoryList";
import { jobQueries } from "@/store/queries/jobs";
import { jobHistoryListRequestSchema } from "@/store/schemas/jobs";

const paramsSchema = jobHistoryListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/jobs/$id/history")({
  validateSearch: paramsSchema,
  search: {
    middlewares: [
      sanitizeSearchParams(paramsSchema),
      stripSearchParams(defaultParams),
    ],
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const loaderData = useLoaderData({ from: "/app/jobs/$id" });
  const navigate = Route.useNavigate();
  const params = Route.useSearch();

  const { job } = loaderData;

  /** Queries */

  const jobHistoryListQuery = useQuery(
    jobQueries.job(job.id).history.list({ params }),
  );

  /** Callbacks */

  const handleOnParamsChange = (
    newParams: Partial<z.infer<typeof paramsSchema>>,
  ) =>
    navigate({
      to: ".",
      replace: true,
      search: (s) => ({ ...s, ...newParams }),
    });

  return (
    <Container sx={{ display: "flex", flexGrow: 1 }}>
      <HistoryList
        items={jobHistoryListQuery.data?.results ?? []}
        count={jobHistoryListQuery.data?.count ?? -1}
        page={params.page}
        pageSize={params.page_size}
        search={params.search}
        loading={jobHistoryListQuery.isLoading}
        error={jobHistoryListQuery.error}
        onPageChange={(page) => handleOnParamsChange({ page })}
        onPageSizeChange={(page_size) =>
          handleOnParamsChange({ page: 1, page_size })
        }
        onSearchChange={(search) => handleOnParamsChange({ page: 1, search })}
        sx={{ flexGrow: 1, width: "100%", pb: 2 }}
      />
    </Container>
  );
}
