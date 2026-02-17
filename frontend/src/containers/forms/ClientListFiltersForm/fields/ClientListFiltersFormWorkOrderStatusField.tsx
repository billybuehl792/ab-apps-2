import {
  Checkbox,
  FormControl,
  type FormControlProps,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectProps,
  Stack,
} from "@mui/material";
import WorkOrderStatusChip from "@/containers/chips/WorkOrderStatusChip";
import { WorkOrderStatus } from "@/store/enums/work-orders";

const LABEL_ID = "client-work-orders-status-label";

interface ClientListFiltersFormWorkOrderStatusFieldProps
  extends Omit<FormControlProps, "onChange"> {
  value: WorkOrderStatus[];
  onChange: (value: WorkOrderStatus[]) => void;
}

const ClientListFiltersFormWorkOrderStatusField: React.FC<
  ClientListFiltersFormWorkOrderStatusFieldProps
> = ({ value, onChange, ...props }) => {
  /** Callbacks */

  const handleOnChange: SelectProps<typeof value>["onChange"] = (event) => {
    onChange?.(
      typeof event.target.value === "string"
        ? (event.target.value.split(",") as WorkOrderStatus[])
        : event.target.value
    );
  };

  return (
    <FormControl {...props}>
      <InputLabel id={LABEL_ID}>Work Order Status</InputLabel>
      <Select
        labelId={LABEL_ID}
        value={value}
        multiple
        input={<OutlinedInput label="Work Order Status" />}
        onChange={handleOnChange}
        renderValue={(selected) => (
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {selected.map((status) => (
              <WorkOrderStatusChip key={status} status={status} size="small" />
            ))}
          </Stack>
        )}
      >
        {Object.values(WorkOrderStatus).map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={value.includes(option) ?? false} />
            <WorkOrderStatusChip key={option} status={option} size="small" />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ClientListFiltersFormWorkOrderStatusField;
