import { useFormContext } from "react-hook-form";
import { TextField, type TextFieldProps } from "@mui/material";
import type { ClientForm } from "..";

const MAX_LENGTH = 32;

const ClientFormFirstNameField = (props: TextFieldProps) => {
  /** Values */

  const methods = useFormContext<ClientForm>();

  return (
    <TextField
      label="First Name"
      required
      error={Boolean(methods.formState.errors.first_name)}
      helperText={methods.formState.errors.first_name?.message}
      fullWidth
      {...methods.register("first_name", {
        required: "First name is required",
        maxLength: {
          value: MAX_LENGTH,
          message: `Max length is ${String(MAX_LENGTH)}`,
        },
      })}
      {...props}
    />
  );
};

export default ClientFormFirstNameField;
