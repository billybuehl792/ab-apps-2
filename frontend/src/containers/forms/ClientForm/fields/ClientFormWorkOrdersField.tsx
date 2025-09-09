import { Controller, useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { workOrderQueries } from "@/store/queries/work-orders";
import WorkOrderMenuItem from "@/containers/menu-items/WorkOrderMenuItem";
import WorkOrderChip from "@/containers/chips/WorkOrderChip";
import type { ClientFormValues } from "..";

const ClientFormWorkOrdersField = () => {
  const [search, setSearch] = useDebounce("", 600);

  /** Values */

  const methods = useFormContext<ClientFormValues>();

  /** Queries */

  const workOrderListQuery = useQuery(workOrderQueries.list({ search }));

  return (
    <Controller
      name="work_orders"
      control={methods.control}
      render={({ field, formState }) => (
        <Autocomplete
          value={field.value}
          options={workOrderListQuery.data?.results ?? []}
          multiple
          disabled={field.disabled}
          loading={workOrderListQuery.isLoading}
          getOptionLabel={(option) => option.label}
          getOptionKey={(option) => option.id}
          includeInputInList
          filterOptions={(options) => options}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onInputChange={(_, value) => setSearch(value)}
          renderInput={(params) => (
            <TextField
              name={field.name}
              label="Work Orders"
              inputRef={field.ref}
              {...(formState.errors.work_orders && {
                error: true,
                helperText: formState.errors.work_orders.message,
              })}
              {...params}
              onBlur={field.onBlur}
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {workOrderListQuery.isLoading && (
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
            <WorkOrderMenuItem key={key} workOrder={option} {...props} />
          )}
          renderValue={(value, getItemProps) =>
            value.map((item, index) => {
              const { key, ...itemProps } = getItemProps({ index });
              return (
                <WorkOrderChip workOrder={item} key={key} {...itemProps} />
              );
            })
          }
          onChange={(_, value) => field.onChange(value)}
        />
      )}
    />
  );
};

export default ClientFormWorkOrdersField;
