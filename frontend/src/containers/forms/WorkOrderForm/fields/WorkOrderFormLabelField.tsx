import { useFormContext } from "react-hook-form";
import { TextField, type TextFieldProps } from "@mui/material";
import type { WorkOrderFormValues } from "..";

const MAX_LENGTH = 32;

const WorkOrderFormLabelField = (props: TextFieldProps) => {
  /** Values */

  const methods = useFormContext<WorkOrderFormValues>();

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

export default WorkOrderFormLabelField;
