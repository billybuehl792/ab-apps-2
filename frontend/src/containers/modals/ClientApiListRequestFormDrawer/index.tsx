import { type ComponentProps } from "react";
import Drawer from "@/components/modals/Drawer";
import ClientApiListRequestForm from "@/containers/forms/ClientApiListRequestForm";

interface ClientApiListRequestFormDrawerProps
  extends ComponentProps<typeof Drawer> {
  form: ComponentProps<typeof ClientApiListRequestForm>;
  disableCloseOnSubmit?: boolean;
}

const ClientApiListRequestFormDrawer = ({
  form,
  disableCloseOnSubmit,
  ...props
}: ClientApiListRequestFormDrawerProps) => {
  return (
    <Drawer title="Client List Options" fullHeight {...props}>
      <ClientApiListRequestForm
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

export default ClientApiListRequestFormDrawer;
