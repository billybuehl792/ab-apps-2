import {
  createFileRoute,
  stripSearchParams,
  useLoaderData,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Container } from "@mui/material";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import JobList from "@/containers/lists/JobList";
import { jobQueries } from "@/store/queries/jobs";
import { jobListRequestSchema } from "@/store/schemas/jobs";

const paramsSchema = jobListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/contacts/$id/jobs")({
  validateSearch: paramsSchema,
  search: {
    middlewares: [
      sanitizeSearchParams(paramsSchema),
      stripSearchParams(defaultParams),
    ],
  },
  beforeLoad: () => ({ crumb: null }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const loaderData = useLoaderData({ from: "/app/contacts/$id" });
  const navigate = Route.useNavigate();
  const params = Route.useSearch();

  const { contact } = loaderData;

  /** Queries */

  const jobListQuery = useQuery(
    jobQueries.list({ params: { recipients: [contact.id], ...params } }),
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
      <JobList
        items={jobListQuery.data?.results ?? []}
        count={jobListQuery.data?.count ?? -1}
        page={params.page}
        pageSize={params.page_size}
        search={params.search}
        loading={jobListQuery.isLoading}
        error={jobListQuery.error}
        onPageChange={(page) => handleOnParamsChange({ page })}
        onPageSizeChange={(page_size) =>
          handleOnParamsChange({ page: 1, page_size })
        }
        onSearchChange={(search) => handleOnParamsChange({ page: 1, search })}
        slotProps={{
          root: { flexGrow: 1, width: "100%", pb: 2 },
          card: (job) => ({
            link: { to: "/app/jobs/$id", params: { id: String(job.id) } },
          }),
        }}
      />
    </Container>
  );
}
