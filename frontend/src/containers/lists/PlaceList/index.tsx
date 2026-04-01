import { type ComponentProps } from "react";
import { Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import ButtonLink from "@/components/links/ButtonLink";
import PaginatedList, {
  type IPaginatedListProps,
} from "@/components/lists/PaginatedList";
import PlaceListCard from "./components/cards/PlaceListCard";
import PlaceListOrderingButtonGroup, {
  type IPlaceListOrderingButtonGroupProps,
} from "./components/buttons/PlaceListOrderingButtonGroup";
import { PlaceIcons } from "@/store/constants/places";
import type { TPlace, TPlaceListRequest } from "@/store/types/places";

type TPaginatedListProps = IPaginatedListProps<
  TPlace,
  TPlaceListRequest["params"]
>;
type TCardProps = Partial<Omit<ComponentProps<typeof PlaceListCard>, "place">>;

export interface IPlaceListProps extends Omit<
  TPaginatedListProps,
  "params" | "renderItem" | "onChange" | "slotProps"
> {
  options: TPlaceListRequest;
  onOrderingChange?: IPlaceListOrderingButtonGroupProps["onChange"];
  onCardChange?: TCardProps["onChange"];
  slotProps?: {
    card?: TCardProps | ((place: TPlace) => TCardProps);
    orderingButtonGroup?: Partial<IPlaceListOrderingButtonGroupProps>;
  } & TPaginatedListProps["slotProps"];
}

const PlaceList: React.FC<IPlaceListProps> = ({
  options,
  total,
  loading,
  error,
  empty,
  onOrderingChange,
  onCardChange,
  slotProps: { card: cardProps, ...slotProps } = {},
  ...props
}) => {
  return (
    <PaginatedList
      total={total}
      params={options.params}
      loading={loading}
      error={error}
      empty={
        total === 0 || empty === true
          ? {
              label: "No Places Found",
              icon: <PlaceIcons.List fontSize="large" />,
              ...(options.params.search
                ? { description: `No results for "${options.params.search}".` }
                : {
                    actions: [
                      <ButtonLink
                        children="Create"
                        to="/app/directory/places/create"
                        startIcon={<Add />}
                      />,
                    ],
                  }),
            }
          : empty
      }
      renderItem={(place) => (
        <PlaceListCard
          key={place.id}
          place={place}
          onChange={onCardChange}
          {...(typeof cardProps === "function" ? cardProps(place) : cardProps)}
        />
      )}
      renderSkeletonItem
      slotProps={{
        ...slotProps,
        header: {
          ...(!!onOrderingChange && {
            endContent: (
              <Stack direction="row" spacing={1}>
                {!!onOrderingChange && (
                  <PlaceListOrderingButtonGroup
                    value={options.params.ordering}
                    onChange={onOrderingChange}
                    {...slotProps?.orderingButtonGroup}
                  />
                )}
              </Stack>
            ),
          }),
          ...slotProps?.header,
        },
      }}
      {...props}
    />
  );
};

export default PlaceList;
