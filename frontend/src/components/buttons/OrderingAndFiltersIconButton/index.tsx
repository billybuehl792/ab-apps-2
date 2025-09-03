import { type ComponentProps, useState } from "react";
import {
  Badge,
  Box,
  IconButton,
  Tooltip,
  type IconButtonProps,
} from "@mui/material";
import { Tune } from "@mui/icons-material";
import OrderingAndFiltersForm, {
  type FilterOption,
  type OrderingOption,
} from "@/components/forms/OrderingAndFiltersForm";
import OrderingAndFiltersFormDrawer from "@/components/modals/OrderingAndFiltersFormDrawer";

interface OrderingAndFiltersIconButtonProps<
  O extends OrderingOption,
  F extends FilterOption,
> extends Omit<IconButtonProps, "form"> {
  form: ComponentProps<typeof OrderingAndFiltersForm<O, F>>;
}

const OrderingAndFiltersIconButton = <
  O extends OrderingOption,
  F extends FilterOption,
>({
  form,
  ...props
}: OrderingAndFiltersIconButtonProps<O, F>) => {
  const [open, setOpen] = useState(false);

  /** Values */

  const orderingCount = form.values?.ordering ? 1 : 0;
  const filterCount = form.values?.filters?.length ?? 0;

  /** Callbacks */

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Filter and Ordering">
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
      <OrderingAndFiltersFormDrawer
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

export default OrderingAndFiltersIconButton;
