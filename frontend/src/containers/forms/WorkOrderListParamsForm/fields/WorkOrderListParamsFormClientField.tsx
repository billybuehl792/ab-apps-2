import { Controller, useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { clientQueries } from "@/store/queries/clients";
import ClientMenuItem from "@/containers/menu-items/ClientMenuItem";
import ClientChip from "@/containers/chips/ClientChip";
import type { WorkOrderListParamsFormValues } from "..";

const WorkOrderListParamsFormClientField = () => {
  const [search, setSearch] = useDebounce("", 600);

  /** Values */

  const methods = useFormContext<WorkOrderListParamsFormValues>();

  /** Queries */

  const clientListQuery = useQuery(clientQueries.list({ search }));

  return (
    <Controller
      name="client"
      control={methods.control}
      render={({ field, formState }) => (
        <Autocomplete
          value={field.value ?? []}
          multiple
          options={
            clientListQuery.data?.results.map((client) => client.id) ?? []
          }
          disabled={field.disabled}
          loading={clientListQuery.isLoading}
          getOptionKey={(option) => option}
          getOptionLabel={(option) => String(option)}
          includeInputInList
          filterOptions={(options) => options}
          isOptionEqualToValue={(option, value) => option === value}
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
          renderOption={(props, option) => (
            <ClientMenuItem client={option} {...props} key={option} />
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
          onChange={(_, value) => field.onChange(value)}
        />
      )}
    />
  );
};

export default WorkOrderListParamsFormClientField;
