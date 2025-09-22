import { useFormContext } from "react-hook-form";
import {
  Grow,
  IconButton,
  ListSubheader,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { FilterAltOff } from "@mui/icons-material";
import type { WorkOrderListParamsFormValues } from "..";

const WorkOrderListParamsFormFiltersHead = () => {
  /** Values */

  const methods = useFormContext<WorkOrderListParamsFormValues>();

  methods.watch("status");
  methods.watch("client");
  methods.watch("place__city");

  const isDirty =
    methods.getFieldState("status").isDirty ||
    methods.getFieldState("client").isDirty ||
    methods.getFieldState("place__city").isDirty;

  /** Callbacks */

  const handleResetFilters = () => {
    methods.resetField("status");
    methods.resetField("client");
    methods.resetField("place__city");
  };

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
      <Typography variant="body1">Filter By</Typography>
      <Grow in={isDirty}>
        <Tooltip title="Reset Filters">
          <IconButton size="small" onClick={handleResetFilters}>
            <FilterAltOff fontSize="small" />
          </IconButton>
        </Tooltip>
      </Grow>
    </Stack>
  );
};

export default WorkOrderListParamsFormFiltersHead;
