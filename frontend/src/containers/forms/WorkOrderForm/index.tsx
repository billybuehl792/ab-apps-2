import { type ComponentProps } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import Form from "@/components/forms/Form";
import DollarField from "@/components/fields/DollarField";
import PlaceAutocompleteField from "@/containers/fields/PlaceAutocompleteField";
import WorkOrderStatusChip from "@/containers/chips/WorkOrderStatusChip";
import { WorkOrderStatus } from "@/store/enums/work-orders";
import type { PlaceBasic } from "@/store/types/places";

export type WorkOrderFormValues = {
  label: string;
  description: string;
  status: WorkOrderStatus;
  scheduledDate: string | null;
  completedDate: string | null;
  cost: number;
  place: PlaceBasic | null;
};

type WorkOrderFormProps<T = void> = Omit<
  ComponentProps<typeof Form<WorkOrderFormValues, T>>,
  "renderFields"
>;

const DEFAULT_VALUES: WorkOrderFormValues = {
  label: "",
  description: "",
  status: WorkOrderStatus.New,
  cost: 0,
  scheduledDate: null,
  completedDate: null,
  place: null,
};

const WorkOrderForm = <T,>(props: WorkOrderFormProps<T>) => {
  return (
    <Form
      defaultValues={DEFAULT_VALUES}
      renderFields={(methods) => (
        <>
          <TextField
            label="Title"
            required
            error={!!methods.formState.errors.label}
            helperText={methods.formState.errors.label?.message}
            fullWidth
            {...methods.register("label", {
              required: "Title is required",
              maxLength: { value: 100, message: "Max length is 100" },
            })}
          />
          <TextField
            label="Description"
            required
            multiline
            minRows={3}
            maxRows={6}
            error={Boolean(methods.formState.errors.description)}
            helperText={methods.formState.errors.description?.message}
            fullWidth
            {...methods.register("description", {
              required: "Description is required",
            })}
          />
          <DollarField
            label="Cost"
            required
            error={Boolean(methods.formState.errors.cost)}
            helperText={methods.formState.errors.cost?.message}
            fullWidth
            {...methods.register("cost", {
              required: "Cost is required",
            })}
          />
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
          <Controller
            name="place"
            control={methods.control}
            render={({ field, formState }) => (
              <PlaceAutocompleteField
                label="Address"
                error={!!formState.errors.place}
                helperText={formState.errors.place?.message}
                {...field}
              />
            )}
          />
        </>
      )}
      {...props}
    />
  );
};

export default WorkOrderForm;
