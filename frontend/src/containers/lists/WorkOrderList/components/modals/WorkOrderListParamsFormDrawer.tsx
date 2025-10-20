import { type ComponentProps } from "react";
import Drawer from "@/components/modals/Drawer";
import WorkOrderListParamsForm from "../forms/WorkOrderListParamsForm";

interface WorkOrderListParamsFormDrawerProps
  extends ComponentProps<typeof Drawer> {
  form: ComponentProps<typeof WorkOrderListParamsForm>;
}

const WorkOrderListParamsFormDrawer = ({
  form,
  ...props
}: WorkOrderListParamsFormDrawerProps) => {
  return (
    <Drawer title="Work Order List Options" fullHeight {...props}>
      <WorkOrderListParamsForm
        {...form}
        slotProps={{
          ...form.slotProps,
          container: { flexGrow: 1, ...form.slotProps?.container },
          fieldset: { flexGrow: 1, px: 2, ...form.slotProps?.fieldset },
          actions: {
            direction: "column-reverse",
            position: "sticky",
            bottom: 0,
            p: 2,
            pt: 0,
            bgcolor: (theme) => theme.palette.background.paper,
            zIndex: 2,
            ...form.slotProps?.actions,
          },
        }}
      />
    </Drawer>
  );
};

export default WorkOrderListParamsFormDrawer;
