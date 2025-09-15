import { type ComponentProps, useState } from "react";
import {
  Badge,
  Box,
  IconButton,
  type IconButtonProps,
  Tooltip,
} from "@mui/material";
import { Tune } from "@mui/icons-material";
import ClientApiListRequestFormDrawer from "@/containers/modals/ClientApiListRequestFormDrawer";

interface ClientApiListRequestFormIconButtonProps
  extends Omit<IconButtonProps, "form"> {
  form: ComponentProps<typeof ClientApiListRequestFormDrawer>["form"];
  disableCloseOnSubmit?: boolean;
}

const ClientApiListRequestFormIconButton = ({
  form,
  disableCloseOnSubmit,
  ...props
}: ClientApiListRequestFormIconButtonProps) => {
  const [open, setOpen] = useState(false);

  /** Values */

  const ordering = form.values?.ordering;
  const workOrderStatus = form.values?.work_orders__status;

  const hasFilters = Boolean(ordering || workOrderStatus?.length);

  /** Callbacks */

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="List Options">
        <Box component="span">
          <IconButton onClick={handleOpen} {...props}>
            <Badge color="primary" variant="dot" invisible={!hasFilters}>
              <Tune />
            </Badge>
          </IconButton>
        </Box>
      </Tooltip>
      <ClientApiListRequestFormDrawer
        open={open}
        form={form}
        disableCloseOnSubmit={disableCloseOnSubmit}
        onClose={handleClose}
      />
    </>
  );
};

export default ClientApiListRequestFormIconButton;
