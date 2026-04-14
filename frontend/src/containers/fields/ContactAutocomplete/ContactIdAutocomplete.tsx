import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import ContactAutocomplete from ".";
import { contactEndpoints } from "@/store/constants/contacts";
import { errorUtils } from "@/store/utils/error";
import type { IContactAutocompleteProps } from ".";
import type { TContact } from "@/store/types/contacts";

type TContactId = TContact["id"];

type TValue<TMultiple extends boolean | undefined> = TMultiple extends true
  ? TContactId[]
  : TContactId | null;

interface IContactIdAutocompleteProps<
  TMultiple extends boolean | undefined,
  TDisableClearable extends boolean | undefined,
> extends Omit<
  IContactAutocompleteProps<TMultiple, TDisableClearable>,
  "value" | "onChange"
> {
  value: TValue<TMultiple>;
  onChange?: (value: TValue<TMultiple>) => void;
}

const ContactIdAutocomplete = <
  TMultiple extends boolean | undefined = false,
  TDisableClearable extends boolean | undefined = false,
>({
  multiple,
  value,
  error,
  helperText,
  onChange,
  ...props
}: IContactIdAutocompleteProps<TMultiple, TDisableClearable>) => {
  /** Values */

  const contactIds = useMemo(
    () =>
      (Array.isArray(value)
        ? value
        : value !== null && value !== undefined
          ? [value]
          : []) as TContactId[],
    [value],
  );

  /** Queries */

  const contactQueries = useQueries({
    queries: contactIds.map((contactId) => ({
      queryKey: contactEndpoints.contact(contactId).id,
      queryFn: contactEndpoints.contact(contactId).get,
    })),
  });

  /** Data */

  const isDetailsLoading = contactQueries.some(
    (query) => query.isLoading || query.isFetching,
  );
  const contactDetailsError = contactQueries.find(
    (query) => query.isError,
  )?.error;

  const contactsById = useMemo(
    () =>
      new Map(
        contactQueries
          .map((query) => query.data)
          .filter((contact): contact is TContact => Boolean(contact))
          .map((contact) => [contact.id, contact]),
      ),
    [contactQueries],
  );

  const mappedValue = useMemo(() => {
    if (multiple)
      return contactIds
        .map((contactId) => contactsById.get(contactId))
        .filter((contact): contact is TContact => Boolean(contact));

    const contactId = contactIds[0];
    return contactId ? (contactsById.get(contactId) ?? null) : null;
  }, [multiple, contactIds, contactsById]);

  return (
    <ContactAutocomplete<TMultiple, TDisableClearable>
      {...props}
      multiple={multiple}
      value={
        mappedValue as IContactAutocompleteProps<
          TMultiple,
          TDisableClearable
        >["value"]
      }
      loading={isDetailsLoading}
      error={error || Boolean(contactDetailsError)}
      helperText={
        helperText ||
        (contactDetailsError && errorUtils.getErrorMessage(contactDetailsError))
      }
      onChange={(_, selectedValue) => {
        if (!onChange) return;
        if (multiple)
          onChange(
            (selectedValue as TContact[]).map(
              (contact) => contact.id,
            ) as TValue<TMultiple>,
          );
        else
          onChange(
            ((selectedValue as TContact | null)?.id ??
              null) as TValue<TMultiple>,
          );
      }}
    />
  );
};

export default ContactIdAutocomplete;
