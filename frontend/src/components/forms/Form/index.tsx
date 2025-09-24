import {
  type ReactNode,
  type FormEventHandler,
  useState,
  PropsWithChildren,
} from "react";
import {
  FormProvider,
  useForm,
  type UseFormProps,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import {
  Button,
  type ButtonProps,
  FormHelperText,
  Stack,
  type StackProps,
} from "@mui/material";
import { errorUtils } from "@/store/utils/error";

interface FormProps<T extends FieldValues, R = void>
  extends PropsWithChildren,
    UseFormProps<T> {
  submitLabel?: ReactNode;
  resetLabel?: ReactNode;
  hideReset?: boolean;
  hideRootError?: boolean;
  onSubmit: (data: T) => R;
  onSuccess?: (response: R extends Promise<infer U> ? U : R) => void;
  onReset?: (methods: UseFormReturn<T>) => void;
  slotProps?: {
    container?: StackProps;
    fieldset?: StackProps;
    actions?: StackProps;
    resetButton?: ButtonProps;
    submitButton?: ButtonProps;
  };
}

const Form = <T extends FieldValues, R = void>({
  /** Form */
  values,
  defaultValues,
  disabled,
  resetOptions,

  /** Component */
  children,
  submitLabel = "Submit",
  resetLabel = "Reset",
  hideReset,
  hideRootError,
  onSubmit,
  onSuccess,
  onReset,
  slotProps,
  ...props
}: FormProps<T, R>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Values */

  const methods = useForm<T>({
    values,
    defaultValues,
    resetOptions,
    disabled: disabled || isSubmitting,
    ...props,
  });

  /** Callbacks */

  const handleSubmit = methods.handleSubmit((data) => {
    try {
      methods.clearErrors("root");
      const res = onSubmit(data);
      if (res instanceof Promise) {
        setIsSubmitting(true);
        res
          .then(onSuccess)
          .catch(handleRootError)
          .finally(() => setIsSubmitting(false));
      } else onSuccess?.(res as R extends Promise<infer U> ? U : R);
    } catch (error) {
      handleRootError(error);
    }
  });

  const handleReset: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (onReset) onReset(methods);
    else methods.reset();
  };

  const handleRootError = (error: unknown) => {
    if (hideRootError) return;
    methods.setError("root", {
      message: errorUtils.getErrorMessage(error),
    });
  };

  return (
    <FormProvider {...methods}>
      <Stack
        component="form"
        noValidate
        onSubmit={handleSubmit}
        onReset={handleReset}
        {...slotProps?.container}
      >
        <Stack spacing={2} pb={2} {...slotProps?.fieldset}>
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
          {!hideReset && (
            <Button
              type="reset"
              color="error"
              disabled={methods.formState.disabled}
              {...slotProps?.resetButton}
            >
              {resetLabel}
            </Button>
          )}
          <Button
            type="submit"
            disabled={methods.formState.disabled}
            loading={isSubmitting}
            {...slotProps?.submitButton}
          >
            {submitLabel}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default Form;
