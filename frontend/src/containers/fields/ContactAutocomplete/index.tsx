import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import {
  Autocomplete,
  type AutocompleteProps,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  type TextFieldProps,
  Tooltip,
} from "@mui/material";
import { Error } from "@mui/icons-material";
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
  placeholder = "Search for a contact",
  error,
  helperText,
  required,
  slotProps: { input: inputProps, ...slotProps } = {},
  ...props
}: IContactAutocompleteProps<TMultiple, TDisableClearable>) => {
  /** Values */

  const [input, setInput] = useDebounce("", 600);

  /** Queries */

  const listQuery = useQuery({
    queryKey: [
      contactEndpoints.id,
      contactListRequestSchema.parse({ params: { input: input || undefined } }),
    ] as const,
    queryFn: ({ queryKey }) => contactEndpoints.get(queryKey[1]),
  });

  /** Data */

  const options = listQuery.data?.results ?? [];
  const optionsError = listQuery.error;
  const isOptionsLoading = listQuery.isLoading;

  return (
    <Autocomplete
      options={options}
      loading={isOptionsLoading}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
      onInputChange={(_, newInputValue) => setInput(newInputValue)}
      filterOptions={(options) => options}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          label={label}
          inputRef={inputRef}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          {...inputProps}
          {...params}
          slotProps={{
            ...inputProps?.slotProps,
            input: {
              ...inputProps?.slotProps?.input,
              ...params.InputProps,
              endAdornment: (
                <Stack direction="row" spacing={1} alignItems="center">
                  {isOptionsLoading && (
                    <CircularProgress color="inherit" size={16} />
                  )}
                  {params.InputProps.endAdornment}
                  {!!optionsError && (
                    <Tooltip title={errorUtils.getErrorMessage(optionsError)}>
                      <Error color="error" />
                    </Tooltip>
                  )}
                </Stack>
              ),
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <MenuItem {...props}>
          <ListItemIcon>
            <ContactIcons.Detail />
          </ListItemIcon>
          <ListItemText
            primary={`${option.first_name} ${option.last_name}`}
            secondary={option.place?.address_short}
          />
        </MenuItem>
      )}
      slotProps={slotProps}
      {...props}
    />
  );
};

export default ContactAutocomplete;
