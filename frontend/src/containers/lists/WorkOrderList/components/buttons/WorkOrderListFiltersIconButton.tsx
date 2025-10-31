import { useState, type ComponentProps } from "react";
import {
  Badge,
  Box,
  IconButton,
  type IconButtonProps,
  Tooltip,
} from "@mui/material";
import { Tune } from "@mui/icons-material";
import { useQueries } from "@tanstack/react-query";
import { clientQueries } from "@/store/queries/clients";
import WorkOrderListParamsFormDrawer from "@/containers/modals/WorkOrderListParamsFormDrawer";
import type { WorkOrderListRequestParams } from "@/store/types/work-orders";

type WorkOrderListFilters = Pick<
  WorkOrderListRequestParams,
  "ordering" | "status" | "city" | "client"
>;

interface WorkOrderListFiltersIconButtonProps
  extends Omit<IconButtonProps, "form"> {
  params: WorkOrderListFilters;
  baseParams?: Partial<WorkOrderListFilters>;
  onFiltersChange: (params: WorkOrderListFilters) => void;
  slotProps?: {
    form?: Partial<
      ComponentProps<typeof WorkOrderListParamsFormDrawer>["form"]
    >;
  };
}

const WorkOrderListFiltersIconButton = ({
  params,
  baseParams,
  loading,
  onFiltersChange,
  slotProps,
  ...props
}: WorkOrderListFiltersIconButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  /** Values */

  const mergedParams = { ...params, ...baseParams };

  const isOrdering = !baseParams?.ordering && !!params.ordering;
  const isStatus = !baseParams?.status && !!params.status?.length;
  const isCity = !baseParams?.city && !!params.city?.length;
  const isClient = !baseParams?.client && !!params.client?.length;

  const hasParams = isOrdering || isStatus || isCity || isClient;

  /** Queries */

  const defaultClientParamQueries = useQueries({
    queries: baseParams?.client
      ? baseParams.client.map((clientId) => clientQueries.detail(clientId))
      : [],
  });

  const clientParamQueries = useQueries({
    queries:
      mergedParams.client?.map((clientId) => clientQueries.detail(clientId)) ??
      [],
  });

  /** Callbacks */

  const handleOpen = () => setModalOpen(true);

  const handleClose = () => setModalOpen(false);

  const handleOnFiltersChange: ComponentProps<
    typeof WorkOrderListParamsFormDrawer
  >["form"]["onSubmit"] = (data) => {
    onFiltersChange({
      ordering: data.ordering ?? undefined,
      status: data.statuses?.length ? data.statuses : undefined,
      city: data.cities?.length ? data.cities : undefined,
      client: data.clients?.length
        ? data.clients.map((client) => client.id)
        : undefined,
      ...baseParams,
    });
  };

  return (
    <>
      <Tooltip title="Work Order List Options">
        <Box component="span">
          <IconButton onClick={handleOpen} {...props}>
            <Badge color="primary" variant="dot" invisible={!hasParams}>
              <Tune />
            </Badge>
          </IconButton>
        </Box>
      </Tooltip>

      {/* Modals */}
      <WorkOrderListParamsFormDrawer
        open={modalOpen}
        form={{
          resetOptions: { keepDefaultValues: true },
          defaultValues: {
            ordering: baseParams?.ordering ?? null,
            statuses: baseParams?.status ?? [],
            cities: baseParams?.city ?? [],
            clients:
              defaultClientParamQueries
                .map((client) => client.data)
                .filter((client) => !!client) ?? [],
          },
          values: {
            ordering: mergedParams.ordering ?? null,
            statuses: mergedParams.status ?? [],
            cities: mergedParams.city ?? [],
            clients:
              clientParamQueries
                .map((client) => client.data)
                .filter((client) => !!client) ?? [],
          },
          disabledFields: baseParams
            ? Object.keys(baseParams)
                .map((key) => {
                  if (key === "ordering") return "ordering";
                  else if (key === "status") return "statuses";
                  else if (key === "city") return "cities";
                  else if (key === "client") return "clients";
                })
                .filter((field) => !!field)
            : [],
          onSubmit: handleOnFiltersChange,
          ...slotProps?.form,
        }}
        onClose={handleClose}
      />
    </>
  );
};

export default WorkOrderListFiltersIconButton;
