import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Autocomplete, Chip, CircularProgress, TextField } from "@mui/material";
import { placeQueries } from "@/store/queries/places";
import type { ClientApiListRequestFormValues } from "..";

const ClientApiListRequestFormCityField = () => {
  /** Values */

  const methods = useFormContext<ClientApiListRequestFormValues>();

  /** Queries */

  const citiesQuery = useQuery(placeQueries.cities());

  return (
    <Controller
      name="place__city"
      control={methods.control}
      render={({ field, formState }) => (
        <Autocomplete
          value={field.value ?? []}
          multiple
          options={citiesQuery.data ?? []}
          disabled={field.disabled}
          loading={citiesQuery.isLoading}
          getOptionKey={(option) => option}
          getOptionLabel={(option) => option}
          includeInputInList
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <TextField
              label="City"
              name={field.name}
              inputRef={field.ref}
              {...(formState.errors.place__city && {
                error: true,
                helperText: formState.errors.place__city.message,
              })}
              {...params}
              onBlur={field.onBlur}
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {citiesQuery.isLoading && (
                        <CircularProgress color="inherit" size={20} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
          renderValue={(value, getItemProps) =>
            value.map((item, index) => {
              const { key, ...itemProps } = getItemProps({ index });
              return (
                <Chip key={key} label={item} size="small" {...itemProps} />
              );
            })
          }
          onChange={(_, value) => field.onChange(value)}
        />
      )}
    />
  );
};

export default ClientApiListRequestFormCityField;
