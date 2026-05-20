import React, { useEffect } from "react";
import { useBlocker } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  Button,
  type ButtonProps,
  Stack,
  TextField,
  type StackProps,
  FormHelperText,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleAutocompleteSuggestionAutocomplete from "@/containers/fields/GoogleAutocompleteSuggestionAutocomplete";
import ContactIdAutocomplete from "@/containers/fields/ContactAutocomplete/ContactIdAutocomplete";
import useConfirm from "@/store/hooks/useConfirm";
import useJob from "@/store/hooks/useJob";
import { errorUtils } from "@/store/utils/error";
import { jobCreateSchema } from "@/store/schemas/jobs";
import { NULL_ID } from "@/store/constants/api";
import type { TJob, TJobCreate } from "@/store/types/jobs";

export interface IJobCreateFormProps extends Omit<
  StackProps<"form">,
  "component" | "onSubmit" | "onReset"
> {
  initialValues?: Partial<TJobCreate>;
  onSuccess: (res: TJob) => void;
  onCancel: ButtonProps["onClick"];
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
    cancelButton?: ButtonProps;
  };
}

const DEFAULT_VALUES = jobCreateSchema.parse({});

const JobCreateForm: React.FC<IJobCreateFormProps> = ({
  initialValues,
  onSuccess,
  onCancel,
  slotProps,
  ...props
}) => {
  /** Values */

  const jobHook = useJob(NULL_ID);
  const confirm = useConfirm();
  const methods = useForm({
    resolver: zodResolver(jobCreateSchema),
    defaultValues: DEFAULT_VALUES,
  });

  /** Mutations */

  const createJobMutation = jobHook.mutations.create;

  /** Data */

  const isDirty = methods.formState.isDirty;

  const isFieldDisabled =
    methods.formState.disabled || methods.formState.isSubmitting;

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit((data) => {
    createJobMutation.mutate(data, {
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
    methods.reset({ ...DEFAULT_VALUES, ...initialValues });
  }, [initialValues]);

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
    <Stack
      component="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleOnSubmit(e);
      }}
      onReset={(e) => e.preventDefault()}
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
          disabled={methods.formState.disabled}
          children="Cancel"
          onClick={onCancel}
          {...slotProps?.cancelButton}
        />
        <Button
          type="submit"
          disabled={methods.formState.disabled}
          loading={methods.formState.isValid && methods.formState.isSubmitting}
          children="Submit"
          {...slotProps?.submitButton}
        />
      </Stack>
    </Stack>
  );
};

export default JobCreateForm;
