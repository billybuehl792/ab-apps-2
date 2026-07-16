import React, { Fragment, type ReactNode } from "react";
import { Box, Grid, Pagination, Stack, type StackProps } from "@mui/material";
import StatusWrapper, {
  type IStatusWrapperBaseProps,
} from "@/components/layout/StatusWrapper";
import DocumentListHeader, {
  IDocumentListHeaderProps,
} from "./components/DocumentListHeader";
import DocumentListCard, {
  type IDocumentListCardProps,
} from "./components/DocumentListCard";
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
  selected?: TDocument[];
  options?: IMenuOption[];
  selectedOptions?: IMenuOption[] | ((selected: TDocument[]) => IMenuOption[]);
  cardOptions?: IMenuOption[] | ((document: TDocument) => IMenuOption[]);
  renderCard?: (document: TDocument) => ReactNode;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (search: string) => void;
  onListVariantChange?: (variant: EListVariant) => void;
  onSelectedChange?: (documents: TDocument[]) => void;
  slotProps?: {
    header?: Partial<IDocumentListHeaderProps>;
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
  selected,
  options,
  cardOptions,
  selectedOptions,
  renderCard,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onListVariantChange,
  onSelectedChange,
  slotProps,
  ...props
}) => {
  /** Values */

  const isGrid = listVariant === EListVariant.Grid;
  const pageCount = Math.ceil(count / pageSize);
  const showHeader =
    Boolean(!!onSearchChange || !!search) ||
    Boolean(!!onListVariantChange || !!listVariant) ||
    Boolean(!!onSelectedChange || !!selected?.length) ||
    !!options?.length;

  /** Callbacks */

  const handlePushSelection = (value: TDocument) =>
    onSelectedChange?.([
      ...(selected ?? []).filter((d) => d.id !== value.id),
      value,
    ]);

  const handleReplaceSelection = (document: TDocument) =>
    onSelectedChange?.([document]);

  const handleSelectRange = (items: TDocument[], from: number, to: number) => {
    if (from !== -1 && to !== -1) {
      if (from < to) onSelectedChange?.(items.slice(from, to + 1));
      else onSelectedChange?.(items.slice(to, from + 1).reverse());
    }
  };

  const handleDeselectItem = (value: TDocument) =>
    onSelectedChange?.(selected?.filter((d) => d.id !== value.id) ?? []);

  const handleDeselectAll = () => onSelectedChange?.([]);

  const handleOnCardClick: IDocumentListCardProps["onClick"] = (
    event,
    document,
    isSelected,
  ) => {
    if (event.metaKey || event.ctrlKey) {
      if (isSelected) handleDeselectItem(document);
      else handlePushSelection(document);
    } else if (event.shiftKey)
      handleSelectRange(
        items,
        items.findIndex((d) => d.id === selected?.[0]?.id),
        items.findIndex((d) => d.id === document.id),
      );
    else {
      if (!!selected?.length && selected.length > 1)
        handleReplaceSelection(document);
      else if (isSelected) handleDeselectAll();
      else handleReplaceSelection(document);
    }
  };

  const handleRenderCard: IDocumentListProps["renderCard"] =
    renderCard ??
    ((document) => {
      const isSelected = selected?.some((d) => d.id === document.id);
      return (
        <DocumentListCard
          document={document}
          listVariant={listVariant}
          disabled={disabled}
          selected={isSelected}
          options={
            typeof cardOptions === "function"
              ? cardOptions(document)
              : cardOptions
          }
          onClick={handleOnCardClick}
          {...(typeof slotProps?.card === "function"
            ? slotProps.card(document)
            : slotProps?.card)}
        />
      );
    });

  return (
    <Stack position="relative" spacing={2} {...props}>
      {!!showHeader && (
        <DocumentListHeader
          search={search}
          loading={!!loading}
          listVariant={listVariant}
          options={options}
          selected={selected}
          selectedOptions={selectedOptions}
          disabled={disabled}
          onSearchChange={onSearchChange}
          onListVariantChange={onListVariantChange}
          onSelectedChange={onSelectedChange}
          {...slotProps?.header}
        />
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
          flexGrow={1}
        >
          {items.map((document) =>
            isGrid ? (
              <Grid key={document.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                {handleRenderCard(document)}
              </Grid>
            ) : (
              <Fragment key={document.id}>
                {handleRenderCard(document)}
              </Fragment>
            ),
          )}
        </StatusWrapper>
      </Box>
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

export default DocumentList;
