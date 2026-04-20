import React, { useEffect, type ChangeEventHandler } from "react";
import {
  FormState,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  type ButtonProps,
  Stack,
  type StackProps,
} from "@mui/material";
import { errorUtils } from "@/store/utils/error";
import z from "zod";

type TJobListFiltersFormValues = z.infer<typeof jobListFiltersFormSchema>;

export interface IJobListFiltersFormProps extends Omit<
  StackProps<"form">,
  "onSubmit" | "onReset"
> {
  values: TJobListFiltersFormValues;
  onSubmit: SubmitHandler<TJobListFiltersFormValues>;
  onSubmitInvalid?: SubmitErrorHandler<TJobListFiltersFormValues>;
  onFormStateChange?: (
    formState: FormState<typeof jobListFiltersFormSchema._input>,
  ) => void;
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
  };
}

export const jobListFiltersFormSchema = z.object({
  completed: z.boolean().optional(),
  scheduled: z.boolean().optional(),
});

const DEFAULT_VALUES = jobListFiltersFormSchema.parse({});

const JobListFiltersForm: React.FC<IJobListFiltersFormProps> = ({
  values,
  onSubmit,
  onSubmitInvalid,
  onFormStateChange,
  slotProps,
  ...props
}) => {
  /** Values */

  const methods = useForm({
    resolver: zodResolver(jobListFiltersFormSchema),
    values,
    defaultValues: DEFAULT_VALUES,
  });

  // const isFieldDisabled =
  //   methods.formState.disabled || methods.formState.isSubmitting;

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error(error);
      setTimeout(() =>
        methods.setError(
          "root",
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

  /** Effects */

  useEffect(() => {
    onFormStateChange?.(methods.formState);
  }, [onFormStateChange, methods.formState]);

  return (
    <Stack
      component="form"
      noValidate
      onSubmit={handleOnSubmit}
      onReset={handleOnReset}
      {...props}
    >
      <Stack spacing={2} mb={2} {...slotProps?.fields}></Stack>
      <Stack direction="row" justifyContent="end" {...slotProps?.actions}>
        <Button
          type="submit"
          disabled={methods.formState.disabled}
          {...slotProps?.submitButton}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default JobListFiltersForm;
