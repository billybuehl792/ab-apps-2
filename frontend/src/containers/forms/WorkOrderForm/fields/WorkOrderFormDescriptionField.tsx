import { useFormContext } from "react-hook-form";
import { TextField, type TextFieldProps } from "@mui/material";
import type { WorkOrderFormValues } from "..";

const WorkOrderFormDescriptionField = (props: TextFieldProps) => {
  /** Values */

  const methods = useFormContext<WorkOrderFormValues>();

  return (
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
      {...props}
    />
  );
};

export default WorkOrderFormDescriptionField;
