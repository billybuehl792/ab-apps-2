import React from "react";
import OrderingButtonGroup, {
  type IOrderingButtonGroupProps,
} from "@/components/buttons/OrderingButtonGroup";
import { contactListOrderingOptions } from "@/store/constants/contacts";

export interface IContactListOrderingButtonGroupProps extends Omit<
  IOrderingButtonGroupProps<(typeof contactListOrderingOptions)[number][]>,
  "options"
> {
  options?: (typeof contactListOrderingOptions)[number][];
}

const ContactListOrderingButtonGroup: React.FC<
  IContactListOrderingButtonGroupProps
> = ({ options: optionsProp, ...props }) => {
  return (
    <OrderingButtonGroup
      options={optionsProp ?? contactListOrderingOptions}
      size="small"
      width={160}
      {...props}
    />
  );
};

export default ContactListOrderingButtonGroup;
