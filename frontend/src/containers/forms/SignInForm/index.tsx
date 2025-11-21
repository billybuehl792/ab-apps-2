import { type FormEventHandler } from "react";
import z from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  type ButtonProps,
  Stack,
  type StackProps,
  TextField,
} from "@mui/material";
import { errorUtils } from "@/store/utils/error";

interface SignInFormProps
  extends Omit<StackProps<"form">, "onSubmit" | "onReset"> {
  onSubmit: SubmitHandler<z.infer<typeof formSchema>>;
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
  };
}

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(64, { message: "Max length is 64" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(128, { message: "Max length is 128" }),
});

const SignInForm: React.FC<SignInFormProps> = ({ onSubmit, ...props }) => {
  /** Values */

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      setTimeout(() =>
        methods.setError(
          "password",
          { type: "server", message: errorUtils.getErrorMessage(error) },
          { shouldFocus: true }
        )
      );
      throw error;
    }
  });

  const handleOnReset: FormEventHandler = (event) => {
    event.preventDefault();
    methods.reset();
  };

  return (
    <Stack
      component="form"
      noValidate
      onSubmit={handleOnSubmit}
      onReset={handleOnReset}
      {...props}
    >
      <Stack spacing={2} mb={2} {...props.slotProps?.fields}>
        <TextField
          label="Username"
          required
          disabled={
            methods.formState.disabled || methods.formState.isSubmitting
          }
          error={!!methods.formState.errors.username}
          helperText={methods.formState.errors.username?.message}
          {...methods.register("username")}
        />
        <TextField
          type="password"
          label="Password"
          disabled={
            methods.formState.disabled || methods.formState.isSubmitting
          }
          required
          error={!!methods.formState.errors.password}
          helperText={methods.formState.errors.password?.message}
          onFocus={(event) => event.target.select()}
          {...methods.register("password")}
        />
      </Stack>
      <Stack direction="row" justifyContent="end" {...props.slotProps?.actions}>
        <Button
          type="submit"
          disabled={methods.formState.disabled || !methods.formState.isValid}
          loading={methods.formState.isSubmitting}
        >
          Sign In
        </Button>
      </Stack>
    </Stack>
  );
};

export default SignInForm;
