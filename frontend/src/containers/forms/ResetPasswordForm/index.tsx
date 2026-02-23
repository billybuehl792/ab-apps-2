import { type ChangeEventHandler } from "react";
import {
  useForm,
  type SubmitHandler,
  type SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  type ButtonProps,
  Stack,
  type StackProps,
  TextField,
} from "@mui/material";
import { errorUtils } from "@/store/utils/error";
import { resetPasswordRequestSchema } from "@/store/schemas/account";
import type { TResetPasswordRequest } from "@/store/types/account";

interface IResetPasswordFormProps extends Omit<
  StackProps<"form">,
  "onSubmit" | "onReset"
> {
  onSubmit: SubmitHandler<TResetPasswordRequest>;
  onSubmitInvalid?: SubmitErrorHandler<TResetPasswordRequest>;
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
  };
}

const ResetPasswordForm: React.FC<IResetPasswordFormProps> = ({
  onSubmit,
  onSubmitInvalid,
  slotProps,
  ...props
}) => {
  /** Values */

  const methods = useForm({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: { new_password: "", new_password_confirm: "" },
  });

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      setTimeout(() =>
        methods.setError(
          "new_password",
          { type: "server", message: errorUtils.getErrorMessage(error) },
          { shouldFocus: true },
        ),
      );
      throw error;
    }
  }, onSubmitInvalid);

  const handleOnReset: ChangeEventHandler<HTMLFormElement> = (event) => {
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
      <Stack spacing={2} mb={2} {...slotProps?.fields}>
        <TextField
          type="password"
          label="New Password"
          required
          disabled={
            methods.formState.disabled || methods.formState.isSubmitting
          }
          error={!!methods.formState.errors.new_password}
          helperText={methods.formState.errors.new_password?.message}
          onFocus={(event) => event.target.select()}
          {...methods.register("new_password")}
        />
        <TextField
          type="password"
          label="Confirm New Password"
          required
          disabled={
            methods.formState.disabled || methods.formState.isSubmitting
          }
          error={!!methods.formState.errors.new_password_confirm}
          helperText={methods.formState.errors.new_password_confirm?.message}
          onFocus={(event) => event.target.select()}
          {...methods.register("new_password_confirm")}
        />
      </Stack>
      <Stack direction="row" justifyContent="end" {...slotProps?.actions}>
        <Button
          type="submit"
          disabled={methods.formState.disabled}
          loading={methods.formState.isValid && methods.formState.isSubmitting}
          {...slotProps?.submitButton}
        >
          Reset Password
        </Button>
      </Stack>
    </Stack>
  );
};

export default ResetPasswordForm;
