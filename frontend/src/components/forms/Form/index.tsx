import { type ReactNode, type FormEventHandler } from "react";
import {
  FormProvider,
  useForm,
  type UseFormProps,
  type FieldValues,
} from "react-hook-form";
import { Button, FormHelperText, Stack, type StackProps } from "@mui/material";
import { errorUtils } from "@/store/utils/error";

interface FormProps<V extends FieldValues, R = void>
  extends Omit<StackProps<"form">, "onSubmit" | "onReset">,
    UseFormProps<V> {
  submitLabel?: ReactNode;
  resetLabel?: ReactNode;
  onSubmit: (data: V) => Promise<R>;
  onReset?: VoidFunction | true;
  slotProps?: { fieldset?: StackProps; actions?: StackProps };
}

const Form = <V extends FieldValues, R = void>({
  values,
  children,
  submitLabel = "Submit",
  resetLabel = "Reset",
  onReset,
  onSubmit,
  slotProps,
  ...props
}: FormProps<V, R>) => {
  /** Values */

  const methods = useForm<V>({ values, ...props });

  /** Callbacks */

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      methods.setError("root", { message: errorUtils.getErrorMessage(error) });
    }
  });

  const handleReset: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (onReset !== true) onReset?.();
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <Stack
        component="form"
        noValidate
        spacing={2}
        onSubmit={handleSubmit}
        onReset={handleReset}
        {...props}
      >
        <Stack spacing={2} {...slotProps?.fieldset}>
          {children}
          {!!methods.formState.errors.root && (
            <FormHelperText error>
              {methods.formState.errors.root?.message}
            </FormHelperText>
          )}
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="end"
          {...slotProps?.actions}
        >
          {!!onReset && (
            <Button type="reset" color="error">
              {resetLabel}
            </Button>
          )}
          <Button
            type="submit"
            color="primary"
            disabled={methods.formState.disabled}
            loading={methods.formState.isSubmitting}
          >
            {submitLabel}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default Form;
