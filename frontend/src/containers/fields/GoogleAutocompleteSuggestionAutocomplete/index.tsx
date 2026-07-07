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
import { googleAutocompleteSuggestionListRequestSchema } from "@/store/schemas/places";
import { placeQueries } from "@/store/queries/places";
import { errorUtils } from "@/store/utils/error";
import { PlaceIcons } from "@/store/constants/places";
import type { TGoogleAutocompleteSuggestion } from "@/store/types/places";

type TGoogleAutocompleteSuggestionAutocompleteBaseProps<
  TMultiple extends boolean | undefined,
  TDisableClearable extends boolean | undefined,
> = AutocompleteProps<
  TGoogleAutocompleteSuggestion,
  TMultiple,
  TDisableClearable,
  false
>;

export interface IGoogleAutocompleteSuggestionAutocompleteProps<
  TMultiple extends boolean | undefined,
  TDisableClearable extends boolean | undefined,
> extends Omit<
  TGoogleAutocompleteSuggestionAutocompleteBaseProps<
    TMultiple,
    TDisableClearable
  >,
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
  } & TGoogleAutocompleteSuggestionAutocompleteBaseProps<
    TMultiple,
    TDisableClearable
  >["slotProps"];
}

const GoogleAutocompleteSuggestionAutocomplete = <
  TMultiple extends boolean | undefined = false,
  TDisableClearable extends boolean | undefined = false,
>({
  inputRef,
  label = "Address",
  placeholder = "Search for an address",
  error,
  helperText,
  required,
  slotProps: { input: inputProps, ...slotProps } = {},
  ...props
}: IGoogleAutocompleteSuggestionAutocompleteProps<
  TMultiple,
  TDisableClearable
>) => {
  /** Values */

  const [input, setInput] = useDebounce("", 600);

  /** Queries */

  const listQuery = useQuery({
    ...placeQueries.googleAutocompleteSuggestions.list({ params: { input } }),
    enabled: !!input,
  });

  /** Data */

  const options = listQuery.data?.suggestions ?? [];
  const optionsError = listQuery.error;
  const isOptionsLoading = listQuery.isLoading;

  return (
    <Autocomplete
      options={options}
      loading={isOptionsLoading}
      getOptionKey={(option) => option.placePrediction.placeId} // Assuming each suggestion has a unique placeId
      getOptionLabel={(option) => option.placePrediction.text.text} // Assuming the suggestion text is in this path
      onInputChange={(_, newInputValue) => setInput(newInputValue)}
      filterOptions={(options) => options}
      isOptionEqualToValue={(option, value) =>
        option.placePrediction.placeId === value.placePrediction.placeId
      }
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
      renderOption={({ key, ...props }, option) => (
        <MenuItem key={key} {...props}>
          <ListItemIcon>
            <PlaceIcons.Detail />
          </ListItemIcon>
          <ListItemText primary={option.placePrediction.text.text} />
        </MenuItem>
      )}
      slotProps={slotProps}
      {...props}
    />
  );
};

export default GoogleAutocompleteSuggestionAutocomplete;
