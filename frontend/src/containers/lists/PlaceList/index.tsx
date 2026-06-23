import { useMemo, type ComponentProps } from "react";
import { useQuery } from "@tanstack/react-query";
import { Divider, Stack, type StackProps } from "@mui/material";
import PaginatedList from "@/components/lists/PaginatedList";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import PlaceListCard from "./components/cards/PlaceListCard";
import { PlaceIcons } from "@/store/constants/places";
import placeEndpoints from "@/store/endpoints/places";
import { EObjectChangeType } from "@/store/enums/api";
import type { TPlace, TPlaceListRequest } from "@/store/types/places";

type TCardProps = Partial<Omit<ComponentProps<typeof PlaceListCard>, "place">>;

export interface IPlaceListProps extends StackProps {
  params: TPlaceListRequest["params"];
  onParamsChange: (newParams: TPlaceListRequest["params"]) => void;
  slotProps?: {
    header?: StackProps;
    card?: TCardProps | ((place: TPlace) => TCardProps);
  };
}

const PlaceList: React.FC<IPlaceListProps> = ({
  params,
  onParamsChange,
  slotProps,
  ...props
}) => {
  /** Queries */

  const placeListQuery = useQuery({
    queryKey: [placeEndpoints.id, { params }],
    queryFn: () => placeEndpoints.get({ params }),
  });

  /** Data */

  const total = useMemo(
    () => placeListQuery.data?.count ?? false,
    [placeListQuery.data],
  );

  /** Callbacks */

  const handleOnParamsChange: IPlaceListProps["onParamsChange"] = (newParams) =>
    onParamsChange?.(newParams);

  const handleOnCardChange: TCardProps["onChange"] = (place, type) => {
    if (type === EObjectChangeType.Delete) {
      const isLastItemOnPage =
        placeListQuery.data?.results.at(-1)?.id === place.id;
      const isFirstPage = params.page === 1;
      if (isLastItemOnPage && !isFirstPage)
        handleOnParamsChange({ ...params, page: Math.max(1, params.page - 1) });
      else placeListQuery.refetch();
    }
  };

  return (
    <Stack position="relative" spacing={2} {...props}>
      <Stack {...slotProps?.header}>
        <Stack spacing={2} py={2}>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            alignItems="center"
            justifyContent="flex-start"
          >
            <DebouncedSearchField
              value={params.search}
              size="small"
              loading={!!placeListQuery.isLoading && !!params.search}
              onChange={(value) =>
                handleOnParamsChange({ ...params, page: 1, search: value })
              }
              sx={{ flex: 1 }}
            />
          </Stack>
        </Stack>
        <Divider />
      </Stack>
      <PaginatedList
        items={placeListQuery.data?.results ?? []}
        total={total}
        page={params.page}
        pageSize={params.page_size}
        loading={placeListQuery.isLoading}
        error={placeListQuery.error}
        empty={
          total === 0 && {
            label: "No Places Found",
            icon: <PlaceIcons.List fontSize="large" />,
            ...(params.search && {
              description: `No results for "${params.search}".`,
            }),
          }
        }
        renderItem={(place) => (
          <PlaceListCard
            key={place.id}
            place={place}
            onChange={handleOnCardChange}
            {...(typeof slotProps?.card === "function"
              ? slotProps.card(place)
              : slotProps?.card)}
          />
        )}
        renderSkeletonItem
        onPageChange={(page) => handleOnParamsChange({ ...params, page })}
        onPageSizeChange={(pageSize) =>
          handleOnParamsChange({ ...params, page: 1, page_size: pageSize })
        }
      />
    </Stack>
  );
};

export default PlaceList;
