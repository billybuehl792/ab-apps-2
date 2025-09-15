import { Controller, useFormContext } from "react-hook-form";
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from "@mui/material";
import WorkOrderStatusChip from "@/containers/chips/WorkOrderStatusChip";
import { WorkOrderStatus } from "@/store/enums/work-orders";
import type { WorkOrderApiListRequestFormValues } from "..";

const WorkOrderApiListRequestFormStatusField = () => {
  /** Values */

  const methods = useFormContext<WorkOrderApiListRequestFormValues>();

  return (
    <Controller
      name="status"
      control={methods.control}
      render={({ field }) => {
        return (
          <FormControl>
            <InputLabel id="work-order-status-label">Status</InputLabel>
            <Select
              labelId="work-order-status-label"
              ref={field.ref}
              name={field.name}
              value={field.value ?? []}
              multiple
              input={<OutlinedInput label="Status" />}
              onBlur={field.onBlur}
              onChange={field.onChange}
              renderValue={(selected) => (
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {selected.map((status) => (
                    <WorkOrderStatusChip
                      key={status}
                      status={status}
                      size="small"
                    />
                  ))}
                </Stack>
              )}
            >
              {Object.values(WorkOrderStatus).map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={field.value?.includes(option) ?? false} />
                  <WorkOrderStatusChip
                    key={option}
                    status={option}
                    size="small"
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }}
    />
  );
};

export default WorkOrderApiListRequestFormStatusField;
