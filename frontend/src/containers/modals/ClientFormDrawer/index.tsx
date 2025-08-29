import { type ComponentProps } from "react";
import Drawer from "@/components/modals/Drawer";
import ClientForm from "@/containers/forms/ClientForm";

interface ClientFormDrawerProps extends ComponentProps<typeof Drawer> {
  form: ComponentProps<typeof ClientForm>;
}

const ClientFormDrawer = ({ form, ...props }: ClientFormDrawerProps) => {
  /** Values */

  const isUpdateForm = Boolean(form.values);

  return (
    <Drawer
      title={isUpdateForm ? "Edit Client" : "Create Client"}
      fullHeight
      {...props}
    >
      <ClientForm
        flexGrow={1}
        submitLabel={isUpdateForm ? "Update" : "Create"}
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

export default ClientFormDrawer;
