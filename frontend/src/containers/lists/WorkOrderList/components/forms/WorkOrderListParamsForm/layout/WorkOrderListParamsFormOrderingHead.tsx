import { useFormContext } from "react-hook-form";
import {
  Grow,
  IconButton,
  ListSubheader,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { FilterListOff } from "@mui/icons-material";
import type { WorkOrderListParamsFormValues } from "..";

const WorkOrderListParamsFormOrderingHead = () => {
  /** Values */

  const methods = useFormContext<WorkOrderListParamsFormValues>();

  methods.watch("ordering");

  /** Callbacks */

  const handleResetOrdering = () => methods.resetField("ordering");

  return (
    <Stack
      component={ListSubheader}
      disableGutters
      direction="row"
      spacing={1}
      alignItems="center"
      py={1}
      borderBottom={1}
      borderColor="divider"
      zIndex={2}
    >
      <Typography variant="body1">Ordering</Typography>
      <Grow in={methods.getFieldState("ordering").isDirty}>
        <Tooltip title="Reset Ordering">
          <IconButton size="small" onClick={handleResetOrdering}>
            <FilterListOff fontSize="small" />
          </IconButton>
        </Tooltip>
      </Grow>
    </Stack>
  );
};

export default WorkOrderListParamsFormOrderingHead;
