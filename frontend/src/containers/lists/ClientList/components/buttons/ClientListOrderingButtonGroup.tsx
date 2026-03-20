import React from "react";
import OrderingButtonGroup, {
  type IOrderingButtonGroupProps,
} from "@/components/buttons/OrderingButtonGroup";
import { clientListOrderingOptions } from "@/store/constants/clients";

export interface IClientListOrderingButtonGroupProps extends Omit<
  IOrderingButtonGroupProps<(typeof clientListOrderingOptions)[number][]>,
  "options"
> {
  options?: (typeof clientListOrderingOptions)[number][];
}

const ClientListOrderingButtonGroup: React.FC<
  IClientListOrderingButtonGroupProps
> = ({ options: optionsProp, ...props }) => {
  return (
    <OrderingButtonGroup
      options={optionsProp ?? clientListOrderingOptions}
      size="small"
      width={160}
      {...props}
    />
  );
};

export default ClientListOrderingButtonGroup;
