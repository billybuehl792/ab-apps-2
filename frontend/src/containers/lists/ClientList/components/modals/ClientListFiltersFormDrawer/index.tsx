import React from "react";
import Drawer, { type IDrawerProps } from "@/components/modals/Drawer";
import ClientListFiltersForm, {
  type IClientListFiltersFormProps,
} from "../../forms/ClientListFiltersForm";

interface IClientListFiltersFormDrawerProps extends IDrawerProps {
  form: IClientListFiltersFormProps;
}

const ClientListFiltersFormDrawer: React.FC<
  IClientListFiltersFormDrawerProps
> = ({ form, ...props }) => {
  return (
    <Drawer title="Client List Filters" {...props}>
      <ClientListFiltersForm p={2} {...form} />
    </Drawer>
  );
};

export default ClientListFiltersFormDrawer;
