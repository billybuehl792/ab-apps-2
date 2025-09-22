import { type ComponentProps, type JSX } from "react";
import { Stack, type StackProps } from "@mui/material";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import PaginatedQueryListParamsChipList from "../lists/PaginatedQueryListParamsChipList";
import PaginatedQueryListParamsFormIconButton from "../buttons/PaginatedQueryListParamsFormIconButton";
import type { PaginatedQueryListBaseProps } from "../..";
import type { ApiListRequest } from "@/store/types/api";

interface PaginatedQueryListHeaderProps<
  Params extends ApiListRequest,
  Data = unknown,
> extends PaginatedQueryListBaseProps<Params, Data>,
    Omit<StackProps, "children"> {
  ParamsFormComponent?: ComponentProps<
    typeof PaginatedQueryListParamsFormIconButton<Params>
  >["FormComponent"];
  renderParamsChips?: (params: Params) => JSX.Element;
  slotProps?: {
    searchField?: Omit<
      ComponentProps<typeof DebouncedSearchField>,
      "value" | "onSearch"
    >;
    paramsFormIconButton?: Omit<
      ComponentProps<
        typeof PaginatedQueryListParamsFormIconButton<Params, Data>
      >,
      "queryOptions" | "baseParams" | "onParamsChange" | "FormComponent"
    >;
    paramsChipList?: Omit<
      ComponentProps<typeof PaginatedQueryListParamsChipList<Params, Data>>,
      "queryOptions" | "baseParams" | "onParamsChange"
    >;
  };
}

const PaginatedQueryListHeader = <
  Params extends ApiListRequest,
  Data = unknown,
>({
  queryOptions,
  baseParams,
  ParamsFormComponent,
  onParamsChange,
  renderParamsChips,
  slotProps,
  ...props
}: PaginatedQueryListHeaderProps<Params, Data>) => {
  /** Values */

  const params = queryOptions.queryKey[1] as Params;

  const searchDisabled =
    !!baseParams && Object.keys(baseParams).includes("search");

  /** Callbacks */

  const handleParamsChange = (newParams: Params) =>
    onParamsChange({ ...newParams, ...baseParams });

  return (
    <Stack {...props}>
      <Stack direction="row" spacing={1} alignItems="center">
        <DebouncedSearchField
          value={params.search}
          size="small"
          placeholder="Search..."
          disabled={searchDisabled}
          onSearch={(search) =>
            handleParamsChange({ ...params, page: 1, search })
          }
          {...slotProps?.searchField}
        />
        {!!ParamsFormComponent && (
          <PaginatedQueryListParamsFormIconButton
            queryOptions={queryOptions}
            baseParams={baseParams}
            FormComponent={ParamsFormComponent}
            onParamsChange={handleParamsChange}
            {...slotProps?.paramsFormIconButton}
          />
        )}
      </Stack>
      <PaginatedQueryListParamsChipList
        queryOptions={queryOptions}
        baseParams={baseParams}
        onParamsChange={handleParamsChange}
        renderParamsChips={renderParamsChips}
        mt={1}
        {...slotProps?.paramsChipList}
      />
    </Stack>
  );
};

export default PaginatedQueryListHeader;
