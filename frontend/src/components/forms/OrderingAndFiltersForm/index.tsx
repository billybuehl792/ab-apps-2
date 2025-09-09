import { type ReactNode, type ComponentProps } from "react";
import Form from "../Form";
import OrderingAndFiltersFormOrderingField from "./fields/OrderingAndFiltersFormOrderingField";
import OrderingAndFiltersFormFiltersField from "./fields/OrderingAndFiltersFormFiltersField";

export type OrderingOption<V extends string = string> = {
  /** The unique identifier for the ordering option: `ordering=<value>` */
  value: V;
  label: string;
  disabled?: boolean;
};

export type FilterOption<
  T extends string = string,
  V extends number = number,
> = {
  /** The unique identifier for the filter option: `<id>=<value>` */
  id: T;
  /** The unique value for the filter option: `<id>=<value>` */
  value: V;
  label: string;
  disabled?: boolean;
};

export type OrderingAndFiltersFormValues<
  O extends OrderingOption = OrderingOption,
  F extends FilterOption = FilterOption,
> = {
  ordering?: O;
  filters?: F[];
};

interface OrderingAndFiltersFormProps<
  O extends Readonly<OrderingOption>,
  F extends FilterOption,
> extends ComponentProps<typeof Form<OrderingAndFiltersFormValues<O, F>>> {
  orderingLabel?: ReactNode;
  filterLabel?: ReactNode;
  orderingOptions?: ReadonlyArray<O>;
  filterOptions?: ReadonlyArray<F>;
}

const OrderingAndFiltersForm = <
  O extends OrderingOption,
  F extends FilterOption,
>({
  orderingLabel,
  filterLabel,
  orderingOptions,
  filterOptions,
  ...props
}: OrderingAndFiltersFormProps<O, F>) => {
  return (
    <Form {...props}>
      {!!orderingOptions?.length && (
        <OrderingAndFiltersFormOrderingField
          label={orderingLabel}
          options={orderingOptions}
        />
      )}
      {!!filterOptions?.length && (
        <OrderingAndFiltersFormFiltersField
          label={filterLabel}
          options={filterOptions}
        />
      )}
    </Form>
  );
};

export default OrderingAndFiltersForm;
