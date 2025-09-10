import { Controller, useFormContext } from "react-hook-form";
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { WorkOrderStatus } from "@/store/enums/work-orders";
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
              <Chip
                label={selected.snakeCaseToTitleCase()}
                color={
                  selected === WorkOrderStatus.Completed
                    ? "success"
                    : selected === WorkOrderStatus.Canceled
                      ? "error"
                      : "info"
                }
              />
            )}
            {...field}
          >
            {Object.values(WorkOrderStatus).map((option) => (
              <MenuItem key={option} value={option}>
                {option.snakeCaseToTitleCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};

export default WorkOrderFormStatusField;
