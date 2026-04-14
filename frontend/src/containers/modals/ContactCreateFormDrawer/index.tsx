import React, { type ComponentProps } from "react";
import Drawer, { type IDrawerProps } from "@/components/modals/Drawer";
import ContactCreateForm from "@/containers/forms/ContactCreateForm";

interface IContactCreateFormDrawerProps extends IDrawerProps {
  form: ComponentProps<typeof ContactCreateForm>;
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
