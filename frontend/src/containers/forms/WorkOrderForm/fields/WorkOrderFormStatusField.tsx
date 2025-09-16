import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { WorkOrderStatus } from "@/store/enums/work-orders";
import WorkOrderStatusChip from "@/containers/chips/WorkOrderStatusChip";
import { type WorkOrderFormValues } from "..";

const WorkOrderFormStatusField = () => {
  /** Values */

  const methods = useFormContext<WorkOrderFormValues>();

  return (
    <Controller
      name="status"
      control={methods.control}
      rules={{ required: "Status is required" }}
      render={({ field }) => (
        <FormControl required>
          <InputLabel id="work-order-status-label">Status</InputLabel>
          <Select
            labelId="work-order-status-label"
            disabled={field.disabled}
            input={<OutlinedInput label="Status" />}
            renderValue={(selected) => (
              <WorkOrderStatusChip status={selected} size="small" />
            )}
            {...field}
          >
            {Object.values(WorkOrderStatus).map((option) => (
              <MenuItem key={option} value={option}>
                <WorkOrderStatusChip
                  key={option}
                  status={option}
                  size="small"
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};

export default WorkOrderFormStatusField;
