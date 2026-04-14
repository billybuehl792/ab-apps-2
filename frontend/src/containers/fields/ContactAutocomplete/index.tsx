import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import {
  Autocomplete,
  type AutocompleteProps,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
  type TextFieldProps,
  Typography,
} from "@mui/material";
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
  slotProps: { input: inputProps, ...slotProps } = {},
  ...props
}: IContactAutocompleteProps<TMultiple, TDisableClearable>) => {
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

  return (
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
          "No results found"
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
          <ListItemText primary={`${option.first_name} ${option.last_name}`} />
        </MenuItem>
      )}
      slotProps={slotProps}
      {...props}
    />
  );
};

export default ContactAutocomplete;
