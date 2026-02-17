import React, { type ComponentProps } from "react";
import Drawer from "@/components/modals/Drawer";
import ClientListFiltersForm from "@/containers/forms/ClientListFiltersForm";

interface ClientListFiltersFormDrawerProps
  extends ComponentProps<typeof Drawer> {
  form: ComponentProps<typeof ClientListFiltersForm>;
}

const ClientListFiltersFormDrawer: React.FC<
  ClientListFiltersFormDrawerProps
> = ({ form, ...props }) => {
  return (
    <Drawer title="Client List Filters" {...props}>
      <ClientListFiltersForm p={2} {...form} />
    </Drawer>
  );
};

export default ClientListFiltersFormDrawer;
