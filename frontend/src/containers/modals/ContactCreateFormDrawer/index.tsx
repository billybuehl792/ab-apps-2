import React from "react";
import Drawer, { type IDrawerProps } from "@/components/modals/Drawer";
import ContactCreateForm, {
  type IContactCreateFormProps,
} from "@/containers/forms/ContactCreateForm";

export interface IContactCreateFormDrawerProps extends IDrawerProps {
  form: IContactCreateFormProps;
}

const ContactCreateFormDrawer: React.FC<IContactCreateFormDrawerProps> = ({
  form,
  ...props
}) => {
  return (
    <Drawer title="Create New Contact" {...props}>
      <ContactCreateForm {...form} sx={{ p: 2 }} />
    </Drawer>
  );
};

export default ContactCreateFormDrawer;
