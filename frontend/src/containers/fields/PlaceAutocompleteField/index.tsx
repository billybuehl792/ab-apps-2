import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import {
  Autocomplete,
  type AutocompleteProps,
  CircularProgress,
  TextField,
  type TextFieldProps,
  Typography,
} from "@mui/material";
import { placeQueries } from "@/store/queries/places";
import PlaceMenuItem from "@/containers/menu-items/PlaceMenuItem";
import type { PlaceBasic } from "@/store/types/places";

type PlaceAutocompleteBaseProps = AutocompleteProps<
  PlaceBasic,
  false,
  false,
  false
>;

interface PlaceAutocompleteFieldProps
  extends Omit<
    PlaceAutocompleteBaseProps,
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
  onChange: (place: PlaceBasic | null) => void;
  slotProps?: {
    input?: TextFieldProps;
  } & PlaceAutocompleteBaseProps["slotProps"];
}

const PlaceAutocompleteField = ({
  inputRef,
  label = "Address",
  name,
  placeholder = "Search for a location",
  error,
  helperText,
  required,
  onChange,
  slotProps: { input: inputProps, ...slotProps } = {},
  ...props
}: PlaceAutocompleteFieldProps) => {
  const [input, setInput] = useDebounce("", 600);

  /** Queries */

  const placeListQuery = useQuery(
    placeQueries.googleAutocompleteSuggestions(input)
  );

  return (
    <Autocomplete
      options={placeListQuery.data ?? []}
      loading={placeListQuery.isLoading}
      getOptionKey={(option) => option.google_place_id}
      getOptionLabel={(option) => option.address_short}
      onInputChange={(_, newInputValue) => setInput(newInputValue)}
      filterOptions={(options) => options}
      isOptionEqualToValue={(option, value) =>
        option.google_place_id === value.google_place_id
      }
      noOptionsText={
        placeListQuery.isError ? (
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
          error={error || placeListQuery.isError}
          helperText={helperText}
          {...inputProps}
          {...params}
          slotProps={{
            ...inputProps?.slotProps,
            input: {
              ...inputProps?.slotProps?.input,
              ...params.InputProps,
              endAdornment: (
                <>
                  {placeListQuery.isLoading && (
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
        <PlaceMenuItem key={key} place={option} {...props} />
      )}
      onChange={(_, newValue) => onChange(newValue)}
    />
  );
};

export default PlaceAutocompleteField;
