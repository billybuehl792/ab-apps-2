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
  Typography,
} from "@mui/material";
import { googleAutocompleteSuggestionListRequestSchema } from "@/store/schemas/places";
import { placeEndpoints, PlaceIcons } from "@/store/constants/places";
import { errorUtils } from "@/store/utils/error";
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
  name?: string;
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
  label = "Place",
  name,
  placeholder = "Search for a place",
  error,
  helperText,
  required,
  onChange,
  slotProps: { input: inputProps, ...slotProps } = {},
  ...props
}: IGoogleAutocompleteSuggestionAutocompleteProps<
  TMultiple,
  TDisableClearable
>) => {
  /** Values */

  const [input, setInput] = useDebounce("", 600);

  const listOptions = googleAutocompleteSuggestionListRequestSchema.parse({
    params: { input: input || undefined },
  });

  /** Queries */

  const googleAutocompleteSuggestions = useQuery({
    queryKey: [placeEndpoints.googleAutocompleteSuggestions().id, listOptions],
    queryFn: () =>
      placeEndpoints.googleAutocompleteSuggestions().get(listOptions),
  });

  return (
    <Autocomplete
      options={googleAutocompleteSuggestions.data?.suggestions ?? []}
      loading={googleAutocompleteSuggestions.isLoading}
      getOptionKey={(option) => option.placePrediction.placeId} // Assuming each suggestion has a unique placeId
      getOptionLabel={(option) => option.placePrediction.text.text} // Assuming the suggestion text is in this path
      onInputChange={(_, newInputValue) => setInput(newInputValue)}
      filterOptions={(options) => options}
      isOptionEqualToValue={(option, value) =>
        option.placePrediction.placeId === value.placePrediction.placeId
      }
      noOptionsText={
        googleAutocompleteSuggestions.isError ? (
          <Typography color="error">Error retrieving places</Typography>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>No results found</Typography>
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
          error={error || googleAutocompleteSuggestions.isError}
          helperText={
            helperText ||
            (googleAutocompleteSuggestions.isError &&
              errorUtils.getErrorMessage(googleAutocompleteSuggestions.error))
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
                  {googleAutocompleteSuggestions.isLoading && (
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
            <PlaceIcons.Detail />
          </ListItemIcon>
          <ListItemText primary={option.placePrediction.text.text} />
        </MenuItem>
      )}
      slotProps={slotProps}
      onChange={onChange}
      {...props}
    />
  );
};

export default GoogleAutocompleteSuggestionAutocomplete;
