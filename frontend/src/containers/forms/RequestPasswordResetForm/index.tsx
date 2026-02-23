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
import { requestPasswordResetRequestSchema } from "@/store/schemas/account";
import type { TRequestPasswordResetRequest } from "@/store/types/account";

interface IRequestPasswordResetFormProps extends Omit<
  StackProps<"form">,
  "onSubmit" | "onReset"
> {
  onSubmit: SubmitHandler<TRequestPasswordResetRequest>;
  onSubmitInvalid?: SubmitErrorHandler<TRequestPasswordResetRequest>;
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
  };
}

const RequestPasswordResetForm: React.FC<IRequestPasswordResetFormProps> = ({
  onSubmit,
  onSubmitInvalid,
  slotProps,
  ...props
}) => {
  /** Values */

  const methods = useForm({
    resolver: zodResolver(requestPasswordResetRequestSchema),
    defaultValues: { email: "" },
  });

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      setTimeout(() =>
        methods.setError(
          "email",
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
          label="Email Address"
          placeholder="example@email.com"
          required
          disabled={
            methods.formState.disabled || methods.formState.isSubmitting
          }
          error={!!methods.formState.errors.email}
          helperText={methods.formState.errors.email?.message}
          {...methods.register("email")}
        />
      </Stack>
      <Stack direction="row" justifyContent="end" {...slotProps?.actions}>
        <Button
          type="submit"
          disabled={methods.formState.disabled}
          loading={methods.formState.isValid && methods.formState.isSubmitting}
          {...slotProps?.submitButton}
        >
          Send Reset Link
        </Button>
      </Stack>
    </Stack>
  );
};

export default RequestPasswordResetForm;
