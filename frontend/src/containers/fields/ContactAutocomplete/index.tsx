import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import {
  Autocomplete,
  type AutocompleteProps,
  AutocompleteValue,
  Button,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  type TextFieldProps,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import ContactCreateFormDrawer from "@/containers/modals/ContactCreateFormDrawer";
import { contactListRequestSchema } from "@/store/schemas/contacts";
import { contactEndpoints, ContactIcons } from "@/store/constants/contacts";
import { errorUtils } from "@/store/utils/error";
import type { TContact } from "@/store/types/contacts";

type TContactAutocompleteBaseProps<
  TMultiple extends boolean | undefined,
  TDisableClearable extends boolean | undefined,
> = AutocompleteProps<TContact, TMultiple, TDisableClearable, false>;

export interface IContactAutocompleteProps<
  TMultiple extends boolean | undefined,
  TDisableClearable extends boolean | undefined,
> extends Omit<
  TContactAutocompleteBaseProps<TMultiple, TDisableClearable>,
  | "options"
  | "renderInput"
  | "renderOption"
  | "getOptionLabel"
  | "isOptionEqualToValue"
  | "getOptionKey"
  | "slotProps"
> {
  inputRef?: TextFieldProps["inputRef"];
  name?: string;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  enableCreate?: boolean;
  slotProps?: {
    input?: TextFieldProps;
  } & TContactAutocompleteBaseProps<TMultiple, TDisableClearable>["slotProps"];
}

const ContactAutocomplete = <
  TMultiple extends boolean | undefined = false,
  TDisableClearable extends boolean | undefined = false,
>({
  inputRef,
  label = "Contact",
  name,
  placeholder = "Search for a contact",
  error,
  helperText,
  required,
  enableCreate,
  onChange,
  slotProps: { input: inputProps, ...slotProps } = {},
  ...props
}: IContactAutocompleteProps<TMultiple, TDisableClearable>) => {
  const [createOpen, setCreateOpen] = useState(false);

  /** Values */

  const [input, setInput] = useDebounce("", 600);

  const listOptions = contactListRequestSchema.parse({
    params: { search: input || undefined },
  });

  /** Queries */

  const contactListQuery = useQuery({
    queryKey: [contactEndpoints.id, listOptions],
    queryFn: () => contactEndpoints.get(listOptions),
  });

  /** Callbacks */

  const handleOnCreate = (newContact: TContact) => {
    onChange?.(
      { type: "change" } as React.SyntheticEvent,
      (props.multiple
        ? [...(props.value as TContact[]), newContact]
        : newContact) as AutocompleteValue<
        TContact,
        TMultiple,
        TDisableClearable,
        false
      >,
      "createOption",
    );
    setCreateOpen(false);
  };

  return (
    <>
      <Autocomplete
        options={contactListQuery.data?.results ?? []}
        loading={contactListQuery.isLoading}
        getOptionKey={(option) => option.id}
        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
        onInputChange={(_, newInputValue) => setInput(newInputValue)}
        filterOptions={(options) => options}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        noOptionsText={
          contactListQuery.isError ? (
            <Typography color="error">Error retrieving contacts</Typography>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>No results found</Typography>
              {!!enableCreate && (
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setCreateOpen(true)}
                >
                  Create New
                </Button>
              )}
            </Stack>
          )
        }
        renderInput={(params) => (
          <TextField
            label={label}
            name={name}
            inputRef={inputRef}
            placeholder={placeholder}
            required={required}
            error={error || contactListQuery.isError}
            helperText={
              helperText ||
              (contactListQuery.isError &&
                errorUtils.getErrorMessage(contactListQuery.error))
            }
            {...inputProps}
            {...params}
            slotProps={{
              ...inputProps?.slotProps,
              input: {
                ...inputProps?.slotProps?.input,
                ...params.InputProps,
                endAdornment: (
                  <>
                    {contactListQuery.isLoading && (
                      <CircularProgress color="inherit" size={16} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
        renderOption={({ key, ...props }, option) => (
          <MenuItem key={key} {...props}>
            <ListItemIcon>
              <ContactIcons.Detail />
            </ListItemIcon>
            <ListItemText
              primary={`${option.first_name} ${option.last_name}`}
            />
          </MenuItem>
        )}
        slotProps={slotProps}
        onChange={onChange}
        {...props}
      />
      {!!enableCreate && (
        <ContactCreateFormDrawer
          open={createOpen}
          form={{
            onSuccess: handleOnCreate,
            onCancel: () => setCreateOpen(false),
          }}
          onClose={() => setCreateOpen(false)}
        />
      )}
    </>
  );
};

export default ContactAutocomplete;
