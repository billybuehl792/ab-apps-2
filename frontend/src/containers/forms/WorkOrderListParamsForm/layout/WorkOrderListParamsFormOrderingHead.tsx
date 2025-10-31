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
import { isEqual } from "lodash";

const WorkOrderListParamsFormOrderingHead = ({
  disabled,
}: {
  disabled?: boolean;
}) => {
  /** Values */

  const methods = useFormContext<WorkOrderListParamsFormValues>();

  const ordering = methods.watch("ordering");

  const isDirty = !isEqual(ordering, methods.formState.defaultValues?.ordering);

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
      <Grow in={isDirty}>
        <Tooltip title="Reset Ordering">
          <IconButton
            size="small"
            disabled={disabled}
            onClick={handleResetOrdering}
          >
            <FilterListOff fontSize="small" />
          </IconButton>
        </Tooltip>
      </Grow>
    </Stack>
  );
};

export default WorkOrderListParamsFormOrderingHead;
