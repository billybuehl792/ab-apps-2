import React from "react";
import Drawer, { type IDrawerProps } from "@/components/modals/Drawer";
import JobListFiltersForm, {
  type IJobListFiltersFormProps,
} from "../../forms/JobListFiltersForm";

interface IJobListFiltersFormDrawerProps extends IDrawerProps {
  form: IJobListFiltersFormProps;
}

const JobListFiltersFormDrawer: React.FC<IJobListFiltersFormDrawerProps> = ({
  form,
  ...props
}) => {
  return (
    <Drawer title="Job List Filters" {...props}>
      <JobListFiltersForm p={2} {...form} />
    </Drawer>
  );
};

export default JobListFiltersFormDrawer;
