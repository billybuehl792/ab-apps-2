import { type ComponentProps } from "react";
import Drawer from "@/components/modals/Drawer";
import WorkOrderClientForm from "@/containers/forms/WorkOrderClientForm";

interface WorkOrderClientFormDrawerProps extends ComponentProps<typeof Drawer> {
  form: ComponentProps<typeof WorkOrderClientForm>;
}

const WorkOrderClientFormDrawer = ({
  form,
  ...props
}: WorkOrderClientFormDrawerProps) => {
  return (
    <Drawer title="Work Order Client" fullHeight {...props}>
      <WorkOrderClientForm
        flexGrow={1}
        submitLabel="Assign"
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

export default WorkOrderClientFormDrawer;
