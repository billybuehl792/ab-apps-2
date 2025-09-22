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
import type { ClientListParamsFormValues } from "..";

const ClientListParamsFormFiltersHead = () => {
  /** Values */

  const methods = useFormContext<ClientListParamsFormValues>();

  const workOrdersStatus = methods.watch("work_orders__status");

  /** Callbacks */

  const handleResetFilters = () => {
    methods.setValue("work_orders__status", []);
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

export default ClientListParamsFormFiltersHead;
