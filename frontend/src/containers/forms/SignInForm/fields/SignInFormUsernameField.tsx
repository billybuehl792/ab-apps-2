import { useFormContext } from "react-hook-form";
import { TextField, type TextFieldProps } from "@mui/material";
import { type SignInForm } from "..";

const MAX_LENGTH = 64;

const SignInFormUsernameField = (props: TextFieldProps) => {
  /** Values */

  const methods = useFormContext<SignInForm>();

  return (
    <TextField
      label="Username"
      required
      error={Boolean(methods.formState.errors.username)}
      helperText={methods.formState.errors.username?.message}
      fullWidth
      {...methods.register("username", {
        required: "Username is required",
        maxLength: {
          value: MAX_LENGTH,
          message: `Max length is ${String(MAX_LENGTH)}`,
        },
      })}
      {...props}
    />
  );
};

export default SignInFormUsernameField;
