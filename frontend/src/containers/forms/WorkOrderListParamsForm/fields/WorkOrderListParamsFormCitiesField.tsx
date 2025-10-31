import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import {
  Autocomplete,
  type AutocompleteProps,
  Chip,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import { placeQueries } from "@/store/queries/places";
import { PlaceIcons } from "@/store/constants/places";
import type { WorkOrderListParamsFormValues } from "..";

type WorkOrderListParamsFormCitiesFieldProps = Partial<
  AutocompleteProps<string, true, false, false>
>;

const WorkOrderListParamsFormCitiesField = (
  props: WorkOrderListParamsFormCitiesFieldProps
) => {
  const [enabled, setEnabled] = useState(false);

  /** Values */

  const methods = useFormContext<WorkOrderListParamsFormValues>();

  /** Queries */

  const citiesQuery = useQuery({ ...placeQueries.cities(), enabled });

  return (
    <Controller
      name="cities"
      control={methods.control}
      render={({ field, formState }) => (
        <Autocomplete
          value={field.value}
          multiple
          options={citiesQuery.data ?? []}
          disabled={field.disabled}
          loading={citiesQuery.isLoading}
          getOptionKey={(option) => option}
          getOptionLabel={(option) => option}
          includeInputInList
          disableCloseOnSelect
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <TextField
              label="City"
              name={field.name}
              inputRef={field.ref}
              {...(formState.errors.cities && {
                error: true,
                helperText: formState.errors.cities.message,
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
          renderOption={({ key: _key, ...props }, option) => (
            <MenuItem key={option} {...props}>
              <ListItemIcon>
                <PlaceIcons.Detail />
              </ListItemIcon>
              <ListItemText primary={option} />
            </MenuItem>
          )}
          renderValue={(value, getItemProps) =>
            value.map((item, index) => {
              const { key, ...itemProps } = getItemProps({ index });
              return (
                <Chip
                  key={key}
                  label={item}
                  size="small"
                  icon={<PlaceIcons.Detail />}
                  {...itemProps}
                />
              );
            })
          }
          onOpen={() => setEnabled(true)}
          onClose={() => setEnabled(false)}
          onChange={(_, value) => field.onChange(value)}
          {...props}
        />
      )}
    />
  );
};

export default WorkOrderListParamsFormCitiesField;
