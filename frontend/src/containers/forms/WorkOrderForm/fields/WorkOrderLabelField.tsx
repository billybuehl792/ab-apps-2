import { useFormContext } from "react-hook-form";
import { TextField, type TextFieldProps } from "@mui/material";
import type { WorkOrderForm } from "..";

const MAX_LENGTH = 32;

const WorkOrderLabelField = (props: TextFieldProps) => {
  /** Values */

  const methods = useFormContext<WorkOrderForm>();

  return (
    <TextField
      label="Title"
      required
      error={Boolean(methods.formState.errors.label)}
      helperText={methods.formState.errors.label?.message}
      fullWidth
      {...methods.register("label", {
        required: "Title is required",
        maxLength: {
          value: MAX_LENGTH,
          message: `Max length is ${String(MAX_LENGTH)}`,
        },
      })}
      {...props}
    />
  );
};

export default WorkOrderLabelField;
