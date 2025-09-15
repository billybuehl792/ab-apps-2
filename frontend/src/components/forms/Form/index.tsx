import { type ReactNode, type FormEventHandler, useState } from "react";
import {
  FormProvider,
  useForm,
  type UseFormProps,
  type FieldValues,
} from "react-hook-form";
import { Button, FormHelperText, Stack, type StackProps } from "@mui/material";
import { errorUtils } from "@/store/utils/error";

interface FormProps<TValues extends FieldValues, TResult = void>
  extends Omit<StackProps<"form">, "onSubmit" | "onReset">,
    UseFormProps<TValues> {
  submitLabel?: ReactNode;
  resetLabel?: ReactNode;
  onSubmit: (data: TValues) => TResult | Promise<TResult>;
  onSuccess?: (result: TResult) => void;
  onReset?: VoidFunction | true;
  slotProps?: { fieldset?: StackProps; actions?: StackProps };
}

const Form = <TValues extends FieldValues, TResult = void>({
  values,
  defaultValues,
  children,
  submitLabel = "Submit",
  resetLabel = "Reset",
  onSubmit,
  onSuccess,
  onReset,
  slotProps,
  ...props
}: FormProps<TValues, TResult>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Values */

  const methods = useForm<TValues>({ values, defaultValues, ...props });

  /** Callbacks */

  const handleSubmit = methods.handleSubmit((data) => {
    try {
      setIsSubmitting(true);
      const res = onSubmit(data);
      Promise.resolve(res)
        .then(onSuccess)
        .catch((error) => handleRootError(error));
    } catch (error) {
      handleRootError(error);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleRootError = (error: unknown) =>
    methods.setError("root", {
      message: errorUtils.getErrorMessage(error),
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
            disabled={methods.formState.disabled}
            loading={isSubmitting}
          >
            {submitLabel}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default Form;
