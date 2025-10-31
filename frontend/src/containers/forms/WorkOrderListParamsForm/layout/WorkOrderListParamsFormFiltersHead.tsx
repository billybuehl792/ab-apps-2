import { useFormContext } from "react-hook-form";
import { isEqual } from "lodash";
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

  const [status, client, city] = methods.watch([
    "statuses",
    "clients",
    "cities",
  ]);

  const isDirty =
    !isEqual(status, methods.formState.defaultValues?.statuses) ||
    !isEqual(client, methods.formState.defaultValues?.clients) ||
    !isEqual(city, methods.formState.defaultValues?.cities);

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
