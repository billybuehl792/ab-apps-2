import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { clientQueries } from "@/store/queries/clients";
import ClientMenuItem from "@/containers/menu-items/ClientMenuItem";
import ClientChip from "@/containers/chips/ClientChip";
import type { WorkOrderForm } from "..";

const WorkOrderClientField = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search || undefined, 400);

  /** Values */

  const methods = useFormContext<WorkOrderForm>();

  /** Queries */

  const clientListQuery = useQuery(
    clientQueries.list({ search: debouncedSearch })
  );

  return (
    <Controller
      name="client"
      control={methods.control}
      render={({ field }) => (
        <Autocomplete
          value={field.value ?? null}
          options={clientListQuery.data?.results ?? []}
          getOptionLabel={(option) =>
            `${option.first_name} ${option.last_name}`
          }
          getOptionKey={(option) => option.id}
          loading={clientListQuery.isLoading}
          filterOptions={(options) => options}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Client"
              required
              onChange={(event) => setSearch(event.target.value)}
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
          renderValue={(selected) => (
            <ClientChip
              client={selected}
              onDelete={() => field.onChange(null)}
            />
          )}
          onChange={(_, value) => field.onChange(value)}
        />
      )}
    />
  );
};

export default WorkOrderClientField;
