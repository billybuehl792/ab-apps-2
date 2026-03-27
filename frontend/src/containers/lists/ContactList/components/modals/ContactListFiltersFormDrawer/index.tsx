import React from "react";
import Drawer, { type IDrawerProps } from "@/components/modals/Drawer";
import ContactListFiltersForm, {
  type IContactListFiltersFormProps,
} from "../../forms/ContactListFiltersForm";

interface IContactListFiltersFormDrawerProps extends IDrawerProps {
  form: IContactListFiltersFormProps;
}

const ContactListFiltersFormDrawer: React.FC<
  IContactListFiltersFormDrawerProps
> = ({ form, ...props }) => {
  return (
    <Drawer title="Contact List Filters" {...props}>
      <ContactListFiltersForm p={2} {...form} />
    </Drawer>
  );
};

export default ContactListFiltersFormDrawer;
