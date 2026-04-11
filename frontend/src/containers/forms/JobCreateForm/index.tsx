import React, { useEffect, type ChangeEventHandler } from "react";
import {
  Controller,
  FormState,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import {
  Button,
  type ButtonProps,
  Stack,
  TextField,
  type StackProps,
  FormHelperText,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleAutocompleteSuggestionListAutocomplete from "@/containers/fields/GoogleAutocompleteSuggestionListAutocomplete";
import { jobCreateSchema } from "@/store/schemas/jobs";
import { errorUtils } from "@/store/utils/error";
import type { TJobCreate } from "@/store/types/jobs";

interface IJobCreateFormProps extends Omit<
  StackProps<"form">,
  "onSubmit" | "onReset"
> {
  onSubmit: SubmitHandler<TJobCreate>;
  onSubmitInvalid?: SubmitErrorHandler<TJobCreate>;
  onFormStateChange?: (formState: FormState<TJobCreate>) => void;
  onCancel?: ButtonProps["onClick"];
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
    cancelButton?: ButtonProps;
  };
}

const JobCreateForm: React.FC<IJobCreateFormProps> = ({
  onSubmit,
  onSubmitInvalid,
  onFormStateChange,
  onCancel,
  slotProps,
  ...props
}) => {
  /** Values */

  const methods = useForm({
    resolver: zodResolver(jobCreateSchema),
    defaultValues: jobCreateSchema.parse({}),
  });

  const isFieldDisabled =
    methods.formState.disabled || methods.formState.isSubmitting;

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      setTimeout(() => {
        methods.setError("root", {
          type: "server",
          message: errorUtils.getErrorMessage(error),
        });
      });
      throw error;
    }
  }, onSubmitInvalid);

  const handleOnReset: ChangeEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    methods.reset();
  };

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
      <Stack spacing={2} mb={2} {...slotProps?.fields}>
        {!!methods.formState.errors.root && (
          <FormHelperText error>
            {methods.formState.errors.root?.message}
          </FormHelperText>
        )}
        <TextField
          label="Label"
          disabled={isFieldDisabled}
          error={!!methods.formState.errors.label}
          helperText={methods.formState.errors.label?.message}
          fullWidth
          {...methods.register("label")}
        />
        <TextField
          label="Description"
          multiline
          minRows={3}
          required
          disabled={isFieldDisabled}
          error={!!methods.formState.errors.description}
          helperText={methods.formState.errors.description?.message}
          fullWidth
          {...methods.register("description")}
        />
        <Controller
          name="place"
          control={methods.control}
          render={({ field, formState }) => (
            <GoogleAutocompleteSuggestionListAutocomplete
              label="Address"
              disabled={isFieldDisabled}
              error={!!formState.errors.place}
              helperText={formState.errors.place?.message}
              {...field}
            />
          )}
        />
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="end"
        {...slotProps?.actions}
      >
        {!!onCancel && (
          <Button
            variant="text"
            color="error"
            disabled={methods.formState.disabled}
            onClick={onCancel}
            {...slotProps?.cancelButton}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={methods.formState.disabled}
          loading={methods.formState.isValid && methods.formState.isSubmitting}
          {...slotProps?.submitButton}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default JobCreateForm;
