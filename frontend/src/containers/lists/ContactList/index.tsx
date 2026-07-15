import React, { Fragment, type ReactNode } from "react";
import { Pagination, Stack, type StackProps } from "@mui/material";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import StatusWrapper, {
  type IStatusWrapperBaseProps,
} from "@/components/layout/StatusWrapper";
import ContactListCard from "./components/cards/ContactListCard";
import ContactListOrderingField from "./components/fields/ContactListOrderingField";
import { EContactListOrdering } from "@/store/enums/contacts";
import { sxUtils } from "@/store/utils/sx";
import type { TContact } from "@/store/types/contacts";

type TCardProps = Partial<
  Omit<React.ComponentProps<typeof ContactListCard>, "contact">
>;

export interface IContactListProps extends StackProps, IStatusWrapperBaseProps {
  items: TContact[];
  count: number;
  page: number;
  pageSize: number;
  search?: string;
  ordering?: EContactListOrdering | null;
  disabled?: boolean;
  renderCard?: (contact: TContact) => ReactNode;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (search: string) => void;
  onOrderingChange?: (ordering: EContactListOrdering | null) => void;
  slotProps?: {
    root?: StackProps;
    header?: StackProps;
    list?: StackProps;
    card?: TCardProps | ((contact: TContact) => TCardProps);
  };
}

const ContactList: React.FC<IContactListProps> = ({
  items,
  count,
  page,
  pageSize,
  search,
  ordering,
  loading,
  error,
  empty,
  disabled,
  renderCard,
  onSearchChange,
  onOrderingChange,
  onPageChange,
  onPageSizeChange,
  slotProps,
  ...props
}) => {
  /** Values */

  const showHeader = !!onSearchChange || !!onOrderingChange;
  const pageCount = Math.ceil(count / pageSize);

  /** Callbacks */

  const handleRenderCard: IContactListProps["renderCard"] =
    renderCard ??
    ((contact) => (
      <ContactListCard
        contact={contact}
        {...(typeof slotProps?.card === "function"
          ? slotProps.card(contact)
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
          flexWrap="wrap"
          useFlexGap
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
          {!!onOrderingChange && (
            <ContactListOrderingField
              value={ordering ?? null}
              disabled={disabled || !!loading}
              size="small"
              onChange={onOrderingChange}
              sx={{ width: { xs: "100%", sm: 160 } }}
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
              label: "No Contacts",
              description: search?.trim()
                ? `No contacts found for "${search}"`
                : undefined,
            })
          }
          flexGrow={1}
        >
          {items.map((contact) => (
            <Fragment key={contact.id}>{handleRenderCard(contact)}</Fragment>
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

export default ContactList;
