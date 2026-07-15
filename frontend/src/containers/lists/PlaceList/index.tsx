import React, { Fragment, type ReactNode } from "react";
import { Pagination, Stack, type StackProps } from "@mui/material";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import StatusWrapper, {
  type IStatusWrapperBaseProps,
} from "@/components/layout/StatusWrapper";
import PlaceListCard, {
  type IPlaceListCardProps,
} from "./components/cards/PlaceListCard";
import { sxUtils } from "@/store/utils/sx";
import type { TPlace } from "@/store/types/places";

type TCardProps = Partial<Omit<IPlaceListCardProps, "place">>;

export interface IPlaceListProps extends StackProps, IStatusWrapperBaseProps {
  items: TPlace[];
  count: number;
  page: number;
  pageSize: number;
  search?: string;
  disabled?: boolean;
  renderCard?: (place: TPlace) => ReactNode;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (search: string) => void;
  slotProps?: {
    root?: StackProps;
    header?: StackProps;
    list?: StackProps;
    card?: TCardProps | ((place: TPlace) => TCardProps);
  };
}

const PlaceList: React.FC<IPlaceListProps> = ({
  items,
  count,
  page,
  pageSize,
  search,
  loading,
  error,
  empty,
  disabled,
  renderCard,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  slotProps,
  ...props
}) => {
  /** Values */

  const showHeader = !!onSearchChange;
  const pageCount = Math.ceil(count / pageSize);

  /** Callbacks */

  const handleRenderCard: IPlaceListProps["renderCard"] =
    renderCard ??
    ((place) => (
      <PlaceListCard
        place={place}
        {...(typeof slotProps?.card === "function"
          ? slotProps.card(place)
          : slotProps?.card)}
      />
    ));

  return (
    <Stack position="relative" spacing={2} {...slotProps?.root} {...props}>
      {!!showHeader && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          {...slotProps?.header}
          sx={[
            {
              py: 2,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            },
            ...sxUtils.asArray(slotProps?.header?.sx),
          ]}
        >
          {!!onSearchChange && (
            <DebouncedSearchField
              value={search}
              size="small"
              loading={!!loading && !!search}
              onChange={onSearchChange}
              sx={{ flex: 1 }}
            />
          )}
        </Stack>
      )}
      <Stack spacing={1} {...slotProps?.list}>
        <StatusWrapper
          loading={loading}
          error={error}
          empty={
            empty ||
            (items.length === 0 && {
              label: "No Places",
              description: search?.trim()
                ? `No places found for "${search}"`
                : undefined,
            })
          }
          flexGrow={1}
        >
          {items.map((place) => (
            <Fragment key={place.id}>{handleRenderCard(place)}</Fragment>
          ))}
        </StatusWrapper>
      </Stack>
      {pageCount > 1 && (
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Pagination
            page={page}
            count={pageCount}
            variant="outlined"
            disabled={disabled || !!loading}
            onChange={(_, newPage) =>
              page !== newPage && onPageChange?.(newPage)
            }
          />
        </Stack>
      )}
    </Stack>
  );
};

export default PlaceList;
