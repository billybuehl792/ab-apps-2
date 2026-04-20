import React, { useState } from "react";
import FiltersIconButton, {
  type IFiltersIconButtonProps,
} from "@/components/buttons/FiltersIconButton";
import JobListFiltersFormDrawer from "../modals/JobListFiltersFormDrawer";
import {
  jobListFiltersFormSchema,
  type IJobListFiltersFormProps,
} from "../forms/JobListFiltersForm";

export interface IJobListFiltersIconButtonProps extends Omit<
  IFiltersIconButtonProps,
  "form" | "onChange"
> {
  form: IJobListFiltersFormProps;
}

const JobListFiltersIconButton: React.FC<IJobListFiltersIconButtonProps> = ({
  form,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  /** Values */

  const filterParams = jobListFiltersFormSchema.parse(form.values);
  const filterCount = Object.values(filterParams).filter(
    (val) => val !== undefined && val !== null,
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
      <JobListFiltersFormDrawer
        open={open}
        form={form}
        onClose={handleOnClose}
      />
    </>
  );
};

export default JobListFiltersIconButton;
