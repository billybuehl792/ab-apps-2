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
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import GoogleAutocompleteSuggestionAutocomplete from "@/containers/fields/GoogleAutocompleteSuggestionAutocomplete";
import ContactIdAutocomplete from "@/containers/fields/ContactAutocomplete/ContactIdAutocomplete";
import useConfirm from "@/store/hooks/useConfirm";
import { errorUtils } from "@/store/utils/error";
import { jobCreateSchema } from "@/store/schemas/jobs";
import type { TJob, TJobCreate } from "@/store/types/jobs";
import { jobEndpoints } from "@/store/constants/jobs";
import { EObjectChangeType } from "@/store/enums/api";
import { z } from "zod";
import { contactSchema } from "@/store/schemas/contacts";
import ContactAutocomplete from "@/containers/fields/ContactAutocomplete";

type TJobCreateFormValues = z.infer<typeof jobCreateSchema>;

export interface IJobCreateFormProps extends Omit<
  StackProps<"form">,
  "component" | "onSubmit" | "onReset"
> {
  initialValues?: Partial<TJobCreateFormValues>;
  onSuccess: (res: TJob) => void;
  onCancel: ButtonProps["onClick"];
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
    cancelButton?: ButtonProps;
  };
}

const formSchema = z.object({
  description: z.string().default(""),
  representatives: z.array(contactSchema).default([]),
  assignee: z.array(contactSchema).default([]),
  recipient: z.array(contactSchema).default([]),
  referred_by: z.array(contactSchema).default([]),
});

const DEFAULT_VALUES = formSchema.parse({});

const JobCreateForm: React.FC<IJobCreateFormProps> = ({
  initialValues,
  onSuccess,
  onCancel,
  slotProps,
  ...props
}) => {
  /** Values */

  const snackbar = useSnackbar();
  const confirm = useConfirm();
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  /** Mutations */

  const createMutation = useMutation({
    mutationKey: [jobEndpoints.id, EObjectChangeType.Create],
    mutationFn: jobEndpoints.post,
    onSuccess: () =>
      snackbar.enqueueSnackbar(`Job created successfully`, {
        variant: "success",
      }),
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  /** Data */

  const isDirty = methods.formState.isDirty;

  const isFieldDisabled =
    methods.formState.disabled || methods.formState.isSubmitting;

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit((data) => {
    // createMutation.mutate(data, {
    //   onSuccess,
    //   onError: (error) => {
    //     methods.setError("root", {
    //       type: "server",
    //       message: errorUtils.getErrorMessage(error),
    //     });
    //   },
    // });
  });

  /** Effects */

  // useEffect(() => {
  //   methods.reset({ ...DEFAULT_VALUES, ...initialValues });
  // }, [initialValues]);

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
          name="representatives"
          control={methods.control}
          render={({ field, formState }) => (
            <ContactAutocomplete
              multiple
              enableCreate
              label="Sales Representative"
              disabled={isFieldDisabled}
              error={!!formState.errors.representatives}
              helperText={formState.errors.representatives?.message}
              {...field}
            />
          )}
        />
        {/* <Controller
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
        </LocalizationProvider> */}
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
