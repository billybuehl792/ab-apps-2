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

  methods.watch(["statuses", "clients", "cities"]);

  const isDirty =
    methods.getFieldState("statuses").isDirty ||
    methods.getFieldState("clients").isDirty ||
    methods.getFieldState("cities").isDirty;

  /** Callbacks */

  const handleResetFilters = () => {
    methods.resetField("statuses");
    methods.resetField("clients");
    methods.resetField("cities");
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
      <Typography variant="body1">Filters</Typography>
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
