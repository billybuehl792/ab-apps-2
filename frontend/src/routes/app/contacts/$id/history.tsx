import {
  createFileRoute,
  stripSearchParams,
  useLoaderData,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Container } from "@mui/material";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import HistoryList from "@/containers/lists/HistoryList";
import { contactQueries } from "@/store/queries/contacts";
import { contactHistoryListRequestSchema } from "@/store/schemas/contacts";

const paramsSchema = contactHistoryListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/contacts/$id/history")({
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

  const contactHistoryListQuery = useQuery(
    contactQueries.contact(contact.id).history.list({ params }),
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
        items={contactHistoryListQuery.data?.results ?? []}
        count={contactHistoryListQuery.data?.count ?? -1}
        page={params.page}
        pageSize={params.page_size}
        search={params.search}
        loading={contactHistoryListQuery.isLoading}
        error={contactHistoryListQuery.error}
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
