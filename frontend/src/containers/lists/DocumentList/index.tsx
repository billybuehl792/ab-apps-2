import React, { Fragment } from "react";
import { Box, Grid, Pagination, Stack, type StackProps } from "@mui/material";
import DocumentListCard, {
  type IDocumentListCardProps,
} from "./components/DocumentListCard";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import ListVariantSwitch from "@/components/fields/ListVariantSwitch";
import StatusWrapper, {
  type IStatusWrapperBaseProps,
} from "@/components/layout/StatusWrapper";
import { sxUtils } from "@/store/utils/sx";
import { EListVariant } from "@/store/enums/layout";
import type { TDocument } from "@/store/types/documents";

type TCardProps = Partial<Omit<IDocumentListCardProps, "document">>;

export interface IDocumentListProps
  extends StackProps, IStatusWrapperBaseProps {
  items: TDocument[];
  count: number;
  listVariant?: EListVariant;
  page: number;
  pageSize: number;
  search?: string;
  disabled?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (search: string) => void;
  onListVariantChange?: (variant: EListVariant) => void;
  slotProps?: {
    header?: StackProps;
    list?: StackProps;
    card?: TCardProps | ((document: TDocument) => TCardProps);
  };
}

const DocumentList: React.FC<IDocumentListProps> = ({
  items,
  count,
  listVariant,
  page,
  pageSize,
  search,
  loading,
  error,
  empty,
  disabled,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onListVariantChange,
  slotProps,
  ...props
}) => {
  /** Values */

  const showHeader = !!onSearchChange || !!onListVariantChange;
  const isGrid = listVariant === EListVariant.Grid;
  const pageCount = Math.ceil(count / pageSize);

  /** Callbacks */

  const renderCard = (document: TDocument) => (
    <DocumentListCard
      document={document}
      listVariant={listVariant}
      {...(typeof slotProps?.card === "function"
        ? slotProps.card(document)
        : slotProps?.card)}
    />
  );

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
          {!!onListVariantChange && (
            <ListVariantSwitch
              checked={isGrid}
              onChange={(_, v) =>
                onListVariantChange(v ? EListVariant.Grid : EListVariant.List)
              }
            />
          )}
        </Stack>
      )}
      <Box
        {...slotProps?.list}
        {...(isGrid
          ? { component: Grid, container: true, spacing: 1 }
          : { component: Stack, spacing: 1 })}
      >
        <StatusWrapper
          loading={loading}
          error={error}
          empty={
            empty ||
            (items.length === 0 && {
              label: "No Documents",
              description: search?.trim()
                ? `No documents found for "${search}"`
                : undefined,
            })
          }
        >
          {items.map((document) =>
            isGrid ? (
              <Grid key={document.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                {renderCard(document)}
              </Grid>
            ) : (
              <Fragment key={document.id}>{renderCard(document)}</Fragment>
            ),
          )}
        </StatusWrapper>
      </Box>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Pagination
          page={page}
          count={pageCount}
          variant="outlined"
          disabled={disabled || !!loading}
          onChange={(_, newPage) => page !== newPage && onPageChange?.(newPage)}
        />
      </Stack>
    </Stack>
  );
};

export default DocumentList;
