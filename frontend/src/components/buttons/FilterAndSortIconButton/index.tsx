import { type ComponentProps, useState } from "react";
import {
  Badge,
  Box,
  IconButton,
  Tooltip,
  type IconButtonProps,
} from "@mui/material";
import { Tune } from "@mui/icons-material";
import FilterAndSortDrawer from "@/components/modals/FilterAndSortDrawer";

interface FilterAndSortIconButtonProps<O, F>
  extends Omit<IconButtonProps, "form"> {
  form: ComponentProps<typeof FilterAndSortDrawer<O, F>>["form"];
}

const FilterAndSortIconButton = <O, F>({
  form,
  ...props
}: FilterAndSortIconButtonProps<O, F>) => {
  const [open, setOpen] = useState(false);

  /** Values */

  const orderingCount = form.values?.ordering ? 1 : 0;
  const filterCount = form.values?.filters?.length ?? 0;

  /** Callbacks */

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Filter and Sort">
        <Box component="span">
          <IconButton onClick={handleOpen} {...props}>
            <Badge
              color="primary"
              badgeContent={orderingCount + filterCount || undefined}
            >
              <Tune />
            </Badge>
          </IconButton>
        </Box>
      </Tooltip>
      <FilterAndSortDrawer
        open={open}
        form={{
          ...form,
          onSubmit: (data) => form.onSubmit(data).then(handleClose),
        }}
        onClose={handleClose}
      />
    </>
  );
};

export default FilterAndSortIconButton;
