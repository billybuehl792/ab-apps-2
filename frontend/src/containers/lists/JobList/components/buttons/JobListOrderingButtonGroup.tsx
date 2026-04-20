import React from "react";
import OrderingButtonGroup, {
  type IOrderingButtonGroupProps,
} from "@/components/buttons/OrderingButtonGroup";
import { jobListOrderingOptions } from "@/store/constants/jobs";

type TJobListOrderingOption =
  (typeof jobListOrderingOptions)[keyof typeof jobListOrderingOptions];

export interface IJobListOrderingButtonGroupProps extends Omit<
  IOrderingButtonGroupProps<TJobListOrderingOption[]>,
  "options"
> {
  options?: TJobListOrderingOption[];
}

const JobListOrderingButtonGroup: React.FC<
  IJobListOrderingButtonGroupProps
> = ({ options: optionsProp, ...props }) => {
  return (
    <OrderingButtonGroup
      options={optionsProp ?? Object.values(jobListOrderingOptions)}
      size="small"
      width={160}
      {...props}
    />
  );
};

export default JobListOrderingButtonGroup;
