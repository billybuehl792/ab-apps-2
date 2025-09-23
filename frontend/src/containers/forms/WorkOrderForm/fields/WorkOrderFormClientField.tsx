import { Controller, useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { clientQueries } from "@/store/queries/clients";
import ClientMenuItem from "@/containers/menu-items/ClientMenuItem";
import ClientChip from "@/containers/chips/ClientChip";
import type { WorkOrderFormValues } from "..";

const WorkOrderFormClientField = () => {
  const [search, setSearch] = useDebounce("", 600);

  /** Values */

  const methods = useFormContext<WorkOrderFormValues>();

  /** Queries */

  const clientListQuery = useQuery(clientQueries.list({ search }));

  return (
    <Controller
      name="client"
      control={methods.control}
      render={({ field, formState }) => (
        <Autocomplete
          value={field.value ?? null}
          options={clientListQuery.data?.results ?? []}
          disabled={field.disabled}
          loading={clientListQuery.isLoading}
          getOptionLabel={(option) => option.full_name}
          getOptionKey={(option) => option.id}
          includeInputInList
          filterOptions={(options) => options}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onInputChange={(_, value) => setSearch(value)}
          renderInput={(params) => (
            <TextField
              label="Client"
              name={field.name}
              inputRef={field.ref}
              {...(formState.errors.client && {
                error: true,
                helperText: formState.errors.client.message,
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
          renderOption={({ key, ...props }, option) => (
            <ClientMenuItem key={key} client={option} {...props} />
          )}
          renderValue={(selected, getItemProps) => (
            <ClientChip client={selected} {...getItemProps()} />
          )}
          onChange={(_, value) => field.onChange(value)}
        />
      )}
    />
  );
};

export default WorkOrderFormClientField;
