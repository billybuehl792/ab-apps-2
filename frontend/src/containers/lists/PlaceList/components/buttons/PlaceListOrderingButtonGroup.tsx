import React from "react";
import OrderingButtonGroup, {
  type IOrderingButtonGroupProps,
} from "@/components/buttons/OrderingButtonGroup";
import { placeListOrderingOptions } from "@/store/constants/places";

export interface IPlaceListOrderingButtonGroupProps extends Omit<
  IOrderingButtonGroupProps<(typeof placeListOrderingOptions)[number][]>,
  "options"
> {
  options?: (typeof placeListOrderingOptions)[number][];
}

const PlaceListOrderingButtonGroup: React.FC<
  IPlaceListOrderingButtonGroupProps
> = ({ options: optionsProp, ...props }) => {
  return (
    <OrderingButtonGroup
      options={optionsProp ?? placeListOrderingOptions}
      size="small"
      width={160}
      {...props}
    />
  );
};

export default PlaceListOrderingButtonGroup;
