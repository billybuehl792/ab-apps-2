import { type ComponentProps, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  Badge,
  Box,
  IconButton,
  type IconButtonProps,
  Tooltip,
} from "@mui/material";
import { Tune } from "@mui/icons-material";
import { clientQueries } from "@/store/queries/clients";
import WorkOrderListParamsFormDrawer from "../modals/WorkOrderListParamsFormDrawer";
import type { WorkOrderListRequestParams } from "@/store/types/work-orders";

interface WorkOrderListParamsFormIconButtonProps
  extends Omit<IconButtonProps, "onChange"> {
  params: WorkOrderListRequestParams;
  onChange?: (params: WorkOrderListRequestParams) => void;
}

const WorkOrderListParamsFormIconButton = ({
  params,
  loading,
  onChange,
  ...props
}: WorkOrderListParamsFormIconButtonProps) => {
  const [open, setOpen] = useState(false);

  /** Values */

  const hasParams =
    !!params.ordering ||
    !!params.status?.length ||
    !!params.client?.length ||
    !!params.city?.length;

  /** Queries */

  const clientsQueries = useQueries({
    queries:
      params.client?.map((clientId) => clientQueries.detail(clientId)) ?? [],
  });

  /** Callbacks */

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleOnSubmit: ComponentProps<
    typeof WorkOrderListParamsFormDrawer
  >["form"]["onSubmit"] = (data) =>
    onChange?.({
      ...params,
      page: undefined,
      ordering: data.ordering ?? undefined,
      status: data.statuses,
      client: data.clients.map((c) => c.id),
      city: data.cities,
    });

  return (
    <>
      <Tooltip title="Work Order List Options">
        <Box component="span">
          <IconButton
            loading={loading || clientsQueries.some((q) => q.isLoading)}
            onClick={handleOpen}
            {...props}
          >
            <Badge color="primary" variant="dot" invisible={!hasParams}>
              <Tune />
            </Badge>
          </IconButton>
        </Box>
      </Tooltip>

      {/* Modals */}
      <WorkOrderListParamsFormDrawer
        open={open}
        form={{
          resetLabel: "Cancel",
          values: {
            ordering: params.ordering ?? null,
            statuses: params.status ?? [],
            cities: params.city ?? [],
            clients: clientsQueries
              .map((query) => query.data)
              .filter((c) => !!c),
          },
          onSubmit: handleOnSubmit,
          onReset: handleClose,
          onSuccess: handleClose,
        }}
        onClose={handleClose}
      />
    </>
  );
};

export default WorkOrderListParamsFormIconButton;
