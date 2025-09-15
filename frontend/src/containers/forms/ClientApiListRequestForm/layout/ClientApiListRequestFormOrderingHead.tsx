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
import type { ClientApiListRequestFormValues } from "..";

const ClientApiListRequestFormOrderingHead = () => {
  /** Values */

  const methods = useFormContext<ClientApiListRequestFormValues>();

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
      <Typography variant="body1">Ordering</Typography>
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

export default ClientApiListRequestFormOrderingHead;
