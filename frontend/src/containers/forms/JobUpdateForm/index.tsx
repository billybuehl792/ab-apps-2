import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useBlocker } from "@tanstack/react-router";
import {
  Button,
  type ButtonProps,
  Stack,
  TextField,
  type StackProps,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import GoogleAutocompleteSuggestionAutocomplete from "@/containers/fields/GoogleAutocompleteSuggestionAutocomplete";
import ContactIdAutocomplete from "@/containers/fields/ContactAutocomplete/ContactIdAutocomplete";
import { jobUpdateSchema } from "@/store/schemas/jobs";
import { errorUtils } from "@/store/utils/error";
import useConfirm from "@/store/hooks/useConfirm";
import useJob from "@/store/hooks/useJob";
import type { TJob } from "@/store/types/jobs";

interface IJobUpdateFormProps extends Omit<
  StackProps<"form">,
  "onSubmit" | "onReset"
> {
  job: TJob;
  onSuccess: (job: TJob) => void;
  onCancel: ButtonProps["onClick"];
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
    cancelButton?: ButtonProps;
  };
}

const JobUpdateForm: React.FC<IJobUpdateFormProps> = ({
  job,
  onSuccess,
  onCancel,
  slotProps,
  ...props
}) => {
  /** Values */

  const confirm = useConfirm();
  const jobHook = useJob(job);
  const methods = useForm({ resolver: zodResolver(jobUpdateSchema) });

  /** Mutations */

  const updateJobMutation = jobHook.mutations.update;

  /** Data */

  const isDirty = methods.formState.isDirty;
  const isSubmitting = updateJobMutation.isPending;
  const isDisabled = methods.formState.disabled;
  const isFieldDisabled = isDisabled || isSubmitting;

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit((data) => {
    updateJobMutation.mutate(data, {
      onSuccess,
      onError: (error) => {
        methods.setError("root", {
          type: "server",
          message: errorUtils.getErrorMessage(error),
        });
      },
    });
  });

  /** Effects */

  useEffect(() => {
    methods.reset(jobUpdateSchema.parse(job));
  }, [job]);

  useBlocker({
    shouldBlockFn: async () => {
      return isDirty
        ? !(await confirm({
            title: "Unsaved Changes",
            description:
              "You have unsaved changes. Are you sure you want to leave?",
            confirmButton: { color: "error", children: "Leave" },
            cancelButton: { color: "primary", children: "Cancel" },
          }))
        : false;
    },
  });

  return (
    <Stack component="form" noValidate onSubmit={handleOnSubmit} {...props}>
      <Stack spacing={2} mb={2} {...slotProps?.fields}>
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
          name="representative"
          control={methods.control}
          render={({ field: { value, disabled, ...field }, formState }) => (
            <ContactIdAutocomplete
              value={value ?? null}
              enableCreate
              label="Sales Representative"
              disabled={isFieldDisabled || disabled}
              error={!!formState.errors.representative}
              helperText={formState.errors.representative?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="place"
          control={methods.control}
          render={({ field: { value, ...field }, formState }) => (
            <GoogleAutocompleteSuggestionAutocomplete
              label="Address"
              disabled={isFieldDisabled}
              error={!!formState.errors.place}
              helperText={formState.errors.place?.message}
              value={value}
              {...field}
            />
          )}
        />
        <Controller
          name="assignee"
          control={methods.control}
          render={({ field: { value, disabled, ...field }, formState }) => (
            <ContactIdAutocomplete
              value={value ?? null}
              enableCreate
              label="Assignee"
              disabled={isFieldDisabled || disabled}
              error={!!formState.errors.assignee}
              helperText={formState.errors.assignee?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="recipient"
          control={methods.control}
          render={({ field: { value, disabled, ...field }, formState }) => (
            <ContactIdAutocomplete
              value={value ?? null}
              enableCreate
              label="Recipient"
              disabled={isFieldDisabled || disabled}
              error={!!formState.errors.recipient}
              helperText={formState.errors.recipient?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="referred_by"
          control={methods.control}
          render={({ field: { value, disabled, ...field }, formState }) => (
            <ContactIdAutocomplete
              value={value ?? null}
              enableCreate
              label="Referred By"
              disabled={isFieldDisabled || disabled}
              error={!!formState.errors.referred_by}
              helperText={formState.errors.referred_by?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="place"
          control={methods.control}
          render={({ field, formState }) => (
            <GoogleAutocompleteSuggestionAutocomplete
              label="Location"
              disabled={isFieldDisabled}
              error={!!formState.errors.place}
              helperText={formState.errors.place?.message}
              {...field}
            />
          )}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="scheduled_at"
            control={methods.control}
            render={({ field: { value, onChange, ...field }, formState }) => (
              <DateTimePicker
                label="Scheduled At"
                value={dayjs(value) ?? null}
                disabled={isFieldDisabled}
                onChange={(newValue) =>
                  onChange(newValue?.toISOString() ?? null)
                }
                slotProps={{
                  field: {
                    clearable: true,
                    onClear: () => onChange(null),
                  },
                  textField: {
                    error: !!formState.errors.scheduled_at,
                    helperText: formState.errors.scheduled_at?.message,
                  },
                }}
                {...field}
              />
            )}
          />
          <Controller
            name="completed_at"
            control={methods.control}
            render={({ field: { value, onChange, ...field }, formState }) => (
              <DateTimePicker
                label="Completed At"
                value={dayjs(value) ?? null}
                disabled={isFieldDisabled}
                onChange={(newValue) =>
                  onChange(newValue?.toISOString() ?? null)
                }
                slotProps={{
                  field: {
                    clearable: true,
                    onClear: () => onChange(null),
                  },
                  textField: {
                    error: !!formState.errors.scheduled_at,
                    helperText: formState.errors.scheduled_at?.message,
                  },
                }}
                {...field}
              />
            )}
          />
        </LocalizationProvider>
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="end"
        {...slotProps?.actions}
      >
        <Button
          variant="text"
          color="error"
          children="Cancel"
          onClick={onCancel}
          {...slotProps?.cancelButton}
        />
        <Button
          type="submit"
          disabled={isDisabled}
          loading={isSubmitting}
          children="Save"
          {...slotProps?.submitButton}
        />
      </Stack>
    </Stack>
  );
};

export default JobUpdateForm;
