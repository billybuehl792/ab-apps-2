import React, { useState } from "react";
import FiltersIconButton, {
  type IFiltersIconButtonProps,
} from "@/components/buttons/FiltersIconButton";
import ContactListFiltersFormDrawer from "../modals/ContactListFiltersFormDrawer";
import {
  contactListFiltersFormSchema,
  type IContactListFiltersFormProps,
} from "../forms/ContactListFiltersForm";

export interface IContactListFiltersIconButtonProps extends Omit<
  IFiltersIconButtonProps,
  "form" | "onChange"
> {
  form: IContactListFiltersFormProps;
}

const ContactListFiltersIconButton: React.FC<
  IContactListFiltersIconButtonProps
> = ({ form, ...props }) => {
  const [open, setOpen] = useState(false);

  /** Values */

  const filterParams = contactListFiltersFormSchema.parse(form.values);
  const filterCount = Object.values(filterParams).filter(
    (val) => !!val.length,
  ).length;

  /** Callbacks */

  const handleOnOpen = () => setOpen(true);

  const handleOnClose = () => setOpen(false);

  return (
    <>
      <FiltersIconButton
        count={filterCount}
        onClick={handleOnOpen}
        {...props}
      />
      <ContactListFiltersFormDrawer
        open={open}
        form={form}
        onClose={handleOnClose}
      />
    </>
  );
};

export default ContactListFiltersIconButton;
