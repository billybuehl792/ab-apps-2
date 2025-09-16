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
import type { WorkOrderApiListRequestFormValues } from "..";

const WorkOrderApiListRequestFormFiltersHead = () => {
  /** Values */

  const methods = useFormContext<WorkOrderApiListRequestFormValues>();

  const workOrdersStatus = methods.watch("status");

  /** Callbacks */

  const handleResetFilters = () => {
    methods.setValue("status", []);
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
    >
      <Typography variant="body1">Filter By</Typography>
      <Grow in={!!workOrdersStatus?.length}>
        <Tooltip title="Reset Filters">
          <IconButton size="small" onClick={handleResetFilters}>
            <FilterAltOff fontSize="small" />
          </IconButton>
        </Tooltip>
      </Grow>
    </Stack>
  );
};

export default WorkOrderApiListRequestFormFiltersHead;
