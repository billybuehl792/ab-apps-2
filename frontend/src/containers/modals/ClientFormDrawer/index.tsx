import { type ComponentProps } from "react";
import Drawer from "@/components/modals/Drawer";
import ClientForm from "@/containers/forms/ClientForm";

interface ClientFormDrawerProps extends ComponentProps<typeof Drawer> {
  form: ComponentProps<typeof ClientForm>;
}

const ClientFormDrawer = ({ form, ...props }: ClientFormDrawerProps) => {
  return (
    <Drawer title="Client Form" fullHeight {...props}>
      <ClientForm
        resetLabel="Cancel"
        onReset={props.onClose}
        {...form}
        slotProps={{
          ...form.slotProps,
          container: { flexGrow: 1, ...form.slotProps?.container },
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

export default ClientFormDrawer;
