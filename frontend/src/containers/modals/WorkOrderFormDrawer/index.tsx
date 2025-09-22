import { type ComponentProps } from "react";
import Drawer from "@/components/modals/Drawer";
import WorkOrderForm from "@/containers/forms/WorkOrderForm";

interface WorkOrderFormDrawerProps extends ComponentProps<typeof Drawer> {
  form: ComponentProps<typeof WorkOrderForm>;
}

const WorkOrderFormDrawer = ({ form, ...props }: WorkOrderFormDrawerProps) => {
  /** Values */

  const isUpdateForm = Boolean(form.values);

  return (
    <Drawer
      title={isUpdateForm ? "Edit Work Order" : "Create Work Order"}
      fullHeight
      {...props}
    >
      <WorkOrderForm
        flexGrow={1}
        submitLabel={isUpdateForm ? "Update" : "Create"}
        resetLabel="Cancel"
        onReset={props.onClose}
        {...form}
        slotProps={{
          ...form.slotProps,
          fieldset: { flexGrow: 1, p: 2, ...form.slotProps?.fieldset },
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

export default WorkOrderFormDrawer;
