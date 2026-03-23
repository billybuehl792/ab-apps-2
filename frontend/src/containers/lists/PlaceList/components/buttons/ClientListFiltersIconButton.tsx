import React, { useState } from "react";
import FiltersIconButton, {
  type IFiltersIconButtonProps,
} from "@/components/buttons/FiltersIconButton";
import ClientListFiltersFormDrawer from "../modals/ClientListFiltersFormDrawer";
import {
  clientListFiltersFormSchema,
  type IClientListFiltersFormProps,
} from "../forms/ClientListFiltersForm";

export interface IClientListFiltersIconButtonProps extends Omit<
  IFiltersIconButtonProps,
  "form" | "onChange"
> {
  form: IClientListFiltersFormProps;
}

const ClientListFiltersIconButton: React.FC<
  IClientListFiltersIconButtonProps
> = ({ form, ...props }) => {
  const [open, setOpen] = useState(false);

  /** Values */

  const filterParams = clientListFiltersFormSchema.parse(form.values);
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
      <ClientListFiltersFormDrawer
        open={open}
        form={form}
        onClose={handleOnClose}
      />
    </>
  );
};

export default ClientListFiltersIconButton;
