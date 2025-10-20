import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Add } from "@mui/icons-material";
import CustomLink from "@/components/links/CustomLink";
import WorkOrderList from "@/containers/lists/WorkOrderList";
import StatusCard from "@/components/cards/StatusCard";
import { workOrderListParamsSchema } from "@/store/schemas/work-orders";
import { DEFAULT_LIST_PARAMS } from "@/store/constants/api";
import { page } from "@/store/constants/layout";
import type { WorkOrderListRequestParams } from "@/store/types/work-orders";
import type { RouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/work-orders/")({
  validateSearch: zodValidator(workOrderListParamsSchema),
  search: { middlewares: [stripSearchParams(DEFAULT_LIST_PARAMS)] },
  loader: (): RouteLoaderData => ({
    slotProps: {
      pageHeader: {
        endContent: (
          <CustomLink
            label="Create"
            to="/app/dashboard/work-orders/create"
            Icon={Add}
          />
        ),
      },
    },
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <StatusCard error={error} />,
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Callbacks */

  const handleParamsChange = (newParams: WorkOrderListRequestParams) =>
    navigate({ to: ".", search: newParams });

  return (
    <WorkOrderList
      params={params}
      onParamsChange={handleParamsChange}
      slotProps={{
        header: {
          position: "sticky",
          top: page.header.height + 16,
          zIndex: 2,
          bgcolor: "background.paper",
          boxShadow: (theme) =>
            `0px -${page.header.height / 4}px ${theme.palette.background.paper}`,
        },
      }}
    />
  );
}
