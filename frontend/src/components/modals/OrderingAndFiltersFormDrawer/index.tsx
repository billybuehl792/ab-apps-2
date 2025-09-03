import { type ComponentProps } from "react";
import Drawer from "../Drawer";
import OrderingAndFiltersForm, {
  type FilterOption,
  type OrderingOption,
} from "@/components/forms/OrderingAndFiltersForm";

interface OrderingAndFiltersFormDrawerProps<
  O extends OrderingOption,
  F extends FilterOption,
> extends ComponentProps<typeof Drawer> {
  form: ComponentProps<typeof OrderingAndFiltersForm<O, F>>;
}

const OrderingAndFiltersFormDrawer = <
  O extends OrderingOption,
  F extends FilterOption,
>({
  form,
  ...props
}: OrderingAndFiltersFormDrawerProps<O, F>) => {
  return (
    <Drawer title="Filter and Sort" fullHeight {...props}>
      <OrderingAndFiltersForm
        minWidth={360}
        flexGrow={1}
        resetLabel="Cancel"
        onReset={props.onClose}
        {...form}
        slotProps={{
          ...form.slotProps,
          fieldset: { flexGrow: 1, p: 2, pb: 0, ...form.slotProps?.fieldset },
          actions: {
            direction: "column-reverse",
            position: "sticky",
            bottom: 0,
            p: 2,
            pt: 0,
            bgcolor: (theme) => theme.palette.background.paper,
            zIndex: 1,
            ...form.slotProps?.actions,
          },
        }}
      />
    </Drawer>
  );
};

export default OrderingAndFiltersFormDrawer;
