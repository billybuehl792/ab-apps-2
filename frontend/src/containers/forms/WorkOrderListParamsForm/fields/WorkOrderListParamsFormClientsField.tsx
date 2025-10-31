import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
import {
  Autocomplete,
  type AutocompleteProps,
  CircularProgress,
  TextField,
} from "@mui/material";
import { clientQueries } from "@/store/queries/clients";
import ClientMenuItem from "@/containers/menu-items/ClientMenuItem";
import ClientChip from "@/containers/chips/ClientChip";
import type { WorkOrderListParamsFormValues } from "..";
import { Client } from "@/store/types/clients";

type WorkOrderListParamsFormClientsFieldProps = Partial<
  AutocompleteProps<Client, true, false, false>
>;

const WorkOrderListParamsFormClientsField = (
  props: WorkOrderListParamsFormClientsFieldProps
) => {
  const [enabled, setEnabled] = useState(false);
  const [search, setSearch] = useDebounce("", 600);

  /** Values */

  const methods = useFormContext<WorkOrderListParamsFormValues>();

  /** Queries */

  const clientListQuery = useQuery({
    ...clientQueries.list({ search }),
    enabled,
  });

  return (
    <Controller
      name="clients"
      control={methods.control}
      render={({ field, formState }) => (
        <Autocomplete
          value={field.value}
          multiple
          options={clientListQuery.data?.results ?? []}
          disabled={field.disabled}
          loading={clientListQuery.isLoading}
          getOptionKey={(option) => option.id}
          getOptionLabel={(option) => option.full_name}
          includeInputInList
          disableCloseOnSelect
          filterOptions={(options) => options}
          isOptionEqualToValue={(option, value) => option === value}
          onInputChange={(_, value) => setSearch(value)}
          renderInput={(params) => (
            <TextField
              label="Client"
              name={field.name}
              inputRef={field.ref}
              {...(formState.errors.clients && {
                error: true,
                helperText: formState.errors.clients.message,
              })}
              {...params}
              onBlur={field.onBlur}
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {clientListQuery.isLoading && (
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
            <ClientMenuItem key={option.id} client={option} {...props} />
          )}
          renderValue={(value, getItemProps) =>
            value.map((item, index) => {
              const { key, ...itemProps } = getItemProps({ index });
              return (
                <ClientChip
                  key={key}
                  client={item}
                  size="small"
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

export default WorkOrderListParamsFormClientsField;
