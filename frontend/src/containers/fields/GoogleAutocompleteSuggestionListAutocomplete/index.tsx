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
import { Place as PlaceIcon } from "@mui/icons-material";
import { placeEndpoints } from "@/store/constants/places";
import type { TGoogleAutocompleteSuggestion } from "@/store/types/places";
import { errorUtils } from "@/store/utils/error";

type TPlaceAutocompleteBaseProps = AutocompleteProps<
  TGoogleAutocompleteSuggestion,
  false,
  false,
  false
>;

interface IGoogleAutocompleteSuggestionListAutocompleteProps extends Omit<
  TPlaceAutocompleteBaseProps,
  | "options"
  | "renderInput"
  | "renderOption"
  | "getOptionLabel"
  | "isOptionEqualToValue"
  | "getOptionKey"
  | "slotProps"
  | "onChange"
> {
  inputRef?: TextFieldProps["inputRef"];
  name?: string;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  onChange: (place: TGoogleAutocompleteSuggestion | null) => void;
  sessionToken?: string;
  slotProps?: {
    input?: TextFieldProps;
  } & TPlaceAutocompleteBaseProps["slotProps"];
}

const GoogleAutocompleteSuggestionListAutocomplete: React.FC<
  IGoogleAutocompleteSuggestionListAutocompleteProps
> = ({
  inputRef,
  label = "Address",
  name,
  placeholder = "Search for a location",
  error,
  helperText,
  required,
  sessionToken,
  onChange,
  slotProps: { input: inputProps, ...slotProps } = {},
  ...props
}) => {
  /** Values */

  const [input, setInput] = useDebounce("", 600);
  const params = { input: input.trim(), sessionToken };

  /** Queries */

  const googleAutocompleteSuggestionListQuery = useQuery({
    queryKey: [...placeEndpoints.googleAutocompleteSuggestions().id],
    queryFn: () =>
      placeEndpoints.googleAutocompleteSuggestions().get({ params }),
    enabled: Boolean(input),
  });

  return (
    <Autocomplete
      options={googleAutocompleteSuggestionListQuery.data ?? []}
      loading={googleAutocompleteSuggestionListQuery.isLoading}
      getOptionKey={(option) => option.google_place_id}
      getOptionLabel={(option) => option.address_full}
      onInputChange={(_, newInputValue) => setInput(newInputValue)}
      filterOptions={(options) => options}
      isOptionEqualToValue={(option, value) =>
        option.google_place_id === value.google_place_id
      }
      noOptionsText={
        googleAutocompleteSuggestionListQuery.isError ? (
          <Typography color="error">Error retrieving places</Typography>
        ) : (
          "No places found"
        )
      }
      slotProps={slotProps}
      {...props}
      renderInput={(params) => (
        <TextField
          label={label}
          name={name}
          inputRef={inputRef}
          placeholder={placeholder}
          required={required}
          error={error || googleAutocompleteSuggestionListQuery.isError}
          helperText={
            helperText ||
            (googleAutocompleteSuggestionListQuery.isError &&
              errorUtils.getErrorMessage(
                googleAutocompleteSuggestionListQuery.error,
              ))
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
                  {googleAutocompleteSuggestionListQuery.isLoading && (
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
            <PlaceIcon />
          </ListItemIcon>
          <ListItemText
            primary={option.address_short}
            secondary={`${option.city}, ${option.state}`}
          />
        </MenuItem>
      )}
      onChange={(_, newValue) => onChange(newValue)}
    />
  );
};

export default GoogleAutocompleteSuggestionListAutocomplete;
