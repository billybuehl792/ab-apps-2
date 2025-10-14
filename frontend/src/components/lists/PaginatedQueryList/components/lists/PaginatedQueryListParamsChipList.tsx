import { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chip, Stack, type StackProps } from "@mui/material";
import { FilterAlt, Search, Sort } from "@mui/icons-material";
import type { ListRequestParams } from "@/store/types/api";
import type { PaginatedQueryListBaseProps } from "../..";

interface PaginatedQueryListParamsChipListProps<
  Params extends ListRequestParams,
  Data = unknown,
> extends PaginatedQueryListBaseProps<Params, Data>,
    Omit<StackProps, "children"> {
  renderParamsChips?: (params: Params) => JSX.Element;
}

const PaginatedQueryListParamsChipList = <
  Params extends ListRequestParams,
  Data = unknown,
>({
  queryOptions,
  baseParams = {},
  onParamsChange,
  renderParamsChips,
  ...props
}: PaginatedQueryListParamsChipListProps<Params, Data>) => {
  /** Values */

  const params = queryOptions.queryKey[1] as Params;
  const { ordering, search, page, page_size, ...filters } = params;

  const showOrderingChip =
    !Object.keys(baseParams).includes("ordering") && !!ordering;
  const showSearchChip =
    !Object.keys(baseParams).includes("search") && !!search;

  const selectedFilters = Object.entries(filters).filter(([key, value]) => {
    if (Object.keys(baseParams).includes(key)) return false;
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  });

  const showComponent =
    showOrderingChip || showSearchChip || selectedFilters.length > 0;

  /** Queries */

  const query = useQuery(queryOptions);

  if (!showComponent) return null;
  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" {...props}>
      {showOrderingChip && (
        <Chip
          label={`Ordering: ${ordering.snakeCaseToTitleCase()}`}
          icon={<Sort />}
          size="xs"
          disabled={query.isLoading}
          onDelete={() => onParamsChange({ ...params, ordering: null })}
        />
      )}
      {showSearchChip && (
        <Chip
          label={`Searching: "${search}"`}
          icon={<Search />}
          size="xs"
          disabled={query.isLoading}
          onDelete={() => onParamsChange({ ...params, search: "" })}
        />
      )}
      {selectedFilters.map(([key, value]) => (
        <Chip
          key={key}
          icon={<FilterAlt />}
          label={`${key.snakeCaseToTitleCase()}: ${value}`}
          size="xs"
          disabled={query.isLoading}
          onDelete={() => onParamsChange({ ...params, [key]: null })}
        />
      ))}
    </Stack>
  );
};

export default PaginatedQueryListParamsChipList;
