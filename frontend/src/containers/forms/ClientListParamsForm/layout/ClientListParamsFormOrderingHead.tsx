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
import type { ClientListParamsFormValues } from "..";

const ClientListParamsFormOrderingHead = () => {
  /** Values */

  const methods = useFormContext<ClientListParamsFormValues>();

  const ordering = methods.watch("ordering");

  /** Callbacks */

  const handleResetOrdering = () => methods.setValue("ordering", null);

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
      <Typography variant="body1">Sort By</Typography>
      <Grow in={!!ordering}>
        <Tooltip title="Reset Ordering">
          <IconButton size="small" onClick={handleResetOrdering}>
            <FilterListOff fontSize="small" />
          </IconButton>
        </Tooltip>
      </Grow>
    </Stack>
  );
};

export default ClientListParamsFormOrderingHead;
