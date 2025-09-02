import { type ComponentProps } from "react";
import Drawer from "../Drawer";
import FilterAndSortForm from "@/components/forms/FilterAndSortForm";

interface FilterAndSortDrawerProps<O, F> extends ComponentProps<typeof Drawer> {
  form: ComponentProps<typeof FilterAndSortForm<O, F>>;
  disableCloseOnSubmit?: boolean;
}

const FilterAndSortDrawer = <O, F>({
  form,
  disableCloseOnSubmit,
  ...props
}: FilterAndSortDrawerProps<O, F>) => {
  return (
    <Drawer title="Filter and Sort" fullHeight {...props}>
      <FilterAndSortForm
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

export default FilterAndSortDrawer;
