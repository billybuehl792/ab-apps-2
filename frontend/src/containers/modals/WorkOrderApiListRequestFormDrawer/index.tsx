import { type ComponentProps } from "react";
import Drawer from "@/components/modals/Drawer";
import WorkOrderApiListRequestForm from "@/containers/forms/WorkOrderApiListRequestForm";

interface WorkOrderApiListRequestFormDrawerProps
  extends ComponentProps<typeof Drawer> {
  form: ComponentProps<typeof WorkOrderApiListRequestForm>;
  disableCloseOnSubmit?: boolean;
}

const WorkOrderApiListRequestFormDrawer = ({
  form,
  disableCloseOnSubmit,
  ...props
}: WorkOrderApiListRequestFormDrawerProps) => {
  return (
    <Drawer title="Work Order List Options" fullHeight {...props}>
      <WorkOrderApiListRequestForm
        flexGrow={1}
        resetLabel="Cancel"
        onReset={props.onClose}
        {...(!disableCloseOnSubmit && { onSuccess: props.onClose })}
        {...form}
        slotProps={{
          fieldset: { flexGrow: 1, ...form.slotProps?.fieldset },
          actions: {
            direction: "column-reverse",
            position: "sticky",
            bottom: 0,
            p: 2,
            pt: 0,
            bgcolor: (theme) => theme.palette.background.paper,
            zIndex: 2,
          },
        }}
      />
    </Drawer>
  );
};

export default WorkOrderApiListRequestFormDrawer;
