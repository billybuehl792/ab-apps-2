import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { placeQueries } from "@/store/queries/places";
import PlaceMenuItem from "@/containers/menu-items/PlaceMenuItem";
import type { WorkOrderFormValues } from "..";

const WorkOrderFormPlaceField = () => {
  const [input, setInput] = useDebounce("", 600);

  /** Values */

  const methods = useFormContext<WorkOrderFormValues>();

  /** Queries */

  const placeListQuery = useQuery(
    placeQueries.googleAutocompleteSuggestions(input)
  );

  return (
    <Controller
      name="place"
      control={methods.control}
      rules={{ required: "Location is required" }}
      render={({ field, formState }) => (
        <Autocomplete
          value={field.value ?? null}
          options={placeListQuery.data ?? []}
          disabled={field.disabled}
          loading={placeListQuery.isLoading}
          getOptionKey={(option) => option.google_place_id}
          getOptionLabel={(option) => option.address_short}
          onInputChange={(_, newInputValue) => setInput(newInputValue)}
          filterOptions={(options) => options}
          isOptionEqualToValue={(option, value) =>
            option.google_place_id === value.google_place_id
          }
          renderInput={(params) => (
            <TextField
              label="Location"
              name={field.name}
              inputRef={field.ref}
              placeholder="Search for a location"
              required
              {...(formState.errors.place && {
                error: true,
                helperText: formState.errors.place.message,
              })}
              {...params}
              onBlur={field.onBlur}
              slotProps={{
                input: {
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
          onChange={(_, newValue) => field.onChange(newValue)}
        />
      )}
    />
  );
};

export default WorkOrderFormPlaceField;
