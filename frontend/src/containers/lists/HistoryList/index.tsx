import React, { Fragment, type ReactNode } from "react";
import { Pagination, Stack, type StackProps } from "@mui/material";
import HistoryListCard, {
  type IHistoryListCardProps,
} from "./components/HistoryListCard";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import StatusWrapper, {
  type IStatusWrapperBaseProps,
} from "@/components/layout/StatusWrapper";
import { sxUtils } from "@/store/utils/sx";
import type { THistoryEntry } from "@/store/types/history";

type TCardProps = Partial<Omit<IHistoryListCardProps, "historyEntry">>;

export interface IHistoryListProps extends StackProps, IStatusWrapperBaseProps {
  items: THistoryEntry[];
  count: number;
  page: number;
  pageSize: number;
  search?: string;
  disabled?: boolean;
  renderCard?: (historyEntry: THistoryEntry) => ReactNode;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (search: string) => void;
  slotProps?: {
    header?: StackProps;
    list?: StackProps;
    card?: TCardProps | ((historyEntry: THistoryEntry) => TCardProps);
  };
}

const HistoryList: React.FC<IHistoryListProps> = ({
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

  const handleRenderCard: IHistoryListProps["renderCard"] =
    renderCard ??
    ((historyEntry) => (
      <HistoryListCard
        historyEntry={historyEntry}
        {...(typeof slotProps?.card === "function"
          ? slotProps.card(historyEntry)
          : slotProps?.card)}
      />
    ));

  return (
    <Stack position="relative" spacing={2} {...props}>
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
              label: "No History Entries",
              description: search?.trim()
                ? `No history entries found for "${search}"`
                : undefined,
            })
          }
          flexGrow={1}
        >
          {items.map((historyEntry) => (
            <Fragment key={historyEntry.id}>
              {handleRenderCard(historyEntry)}
            </Fragment>
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

export default HistoryList;
