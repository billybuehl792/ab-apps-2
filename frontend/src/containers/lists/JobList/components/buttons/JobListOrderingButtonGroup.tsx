import React from "react";
import OrderingButtonGroup, {
  type IOrderingButtonGroupProps,
} from "@/components/buttons/OrderingButtonGroup";
import { jobListOrderingOptions } from "@/store/constants/jobs";

export interface IJobListOrderingButtonGroupProps extends Omit<
  IOrderingButtonGroupProps<(typeof jobListOrderingOptions)[number][]>,
  "options"
> {
  options?: (typeof jobListOrderingOptions)[number][];
}

const JobListOrderingButtonGroup: React.FC<
  IJobListOrderingButtonGroupProps
> = ({ options: optionsProp, ...props }) => {
  return (
    <OrderingButtonGroup
      options={optionsProp ?? jobListOrderingOptions}
      size="small"
      width={160}
      {...props}
    />
  );
};

export default JobListOrderingButtonGroup;
