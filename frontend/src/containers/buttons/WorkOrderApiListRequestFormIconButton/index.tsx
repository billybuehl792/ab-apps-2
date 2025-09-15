import { type ComponentProps, useState } from "react";
import {
  Badge,
  Box,
  IconButton,
  type IconButtonProps,
  Tooltip,
} from "@mui/material";
import { Tune } from "@mui/icons-material";
import WorkOrderApiListRequestFormDrawer from "@/containers/modals/WorkOrderApiListRequestFormDrawer";

interface WorkOrderApiListRequestFormIconButtonProps
  extends Omit<IconButtonProps, "form"> {
  form: ComponentProps<typeof WorkOrderApiListRequestFormDrawer>["form"];
  disableCloseOnSubmit?: boolean;
}

const WorkOrderApiListRequestFormIconButton = ({
  form,
  disableCloseOnSubmit,
  ...props
}: WorkOrderApiListRequestFormIconButtonProps) => {
  const [open, setOpen] = useState(false);

  /** Values */

  const ordering = form.values?.ordering;
  const status = form.values?.status;

  const hasFilters = Boolean(ordering || status?.length);

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
      <WorkOrderApiListRequestFormDrawer
        open={open}
        form={form}
        disableCloseOnSubmit={disableCloseOnSubmit}
        onClose={handleClose}
      />
    </>
  );
};

export default WorkOrderApiListRequestFormIconButton;
