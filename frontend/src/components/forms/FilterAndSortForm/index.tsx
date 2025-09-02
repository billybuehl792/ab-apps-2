import { ReactNode, type ComponentProps } from "react";
import Form from "../Form";
import FilterAndSortFormFiltersField from "./fields/FilterAndSortFormFiltersField";
import FilterAndSortFormSortField from "./fields/FilterAndSortFormSortField";

type Option<T> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type FilterAndSortFormValues<O = unknown, F = unknown> = {
  ordering?: Option<O>;
  filters: Option<F>[];
};

interface FilterAndSortFormProps<O, F>
  extends ComponentProps<typeof Form<FilterAndSortFormValues<O, F>>> {
  orderingLabel?: ReactNode;
  filterLabel?: ReactNode;
  orderingOptions?: ReadonlyArray<Option<O>>;
  filterOptions?: ReadonlyArray<Option<F>>;
}

const FilterAndSortForm = <O, F>({
  orderingLabel,
  filterLabel,
  orderingOptions,
  filterOptions,
  ...props
}: FilterAndSortFormProps<O, F>) => {
  return (
    <Form {...props}>
      {!!orderingOptions?.length && (
        <FilterAndSortFormSortField
          label={orderingLabel}
          options={orderingOptions}
        />
      )}
      {!!filterOptions?.length && (
        <FilterAndSortFormFiltersField
          label={filterLabel}
          options={filterOptions}
        />
      )}
    </Form>
  );
};

export default FilterAndSortForm;
