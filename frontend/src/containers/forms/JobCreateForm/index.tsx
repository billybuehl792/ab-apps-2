import React from "react";
import { useBlocker } from "@tanstack/react-router";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  type ButtonProps,
  Stack,
  TextField,
  type StackProps,
  FormHelperText,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Divider,
} from "@mui/material";
import useConfirm from "@/store/hooks/useConfirm";
import GoogleAutocompleteSuggestionAutocomplete from "@/containers/fields/GoogleAutocompleteSuggestionAutocomplete";
import ContactAutocomplete from "@/containers/fields/ContactAutocomplete";
import JobStatusChip from "@/containers/chips/JobStatusChip";
import { googleAutocompleteSuggestionSchema } from "@/store/schemas/places";
import { contactSchema } from "@/store/schemas/contacts";
import { EJobCategory, EJobStatus } from "@/store/enums/jobs";

type TJobCreateFormValues = z.infer<typeof formSchema>;

export interface IJobCreateFormProps extends Omit<
  StackProps<"form">,
  "component" | "onSubmit" | "onReset"
> {
  values?: TJobCreateFormValues;
  onSubmit: SubmitHandler<TJobCreateFormValues>;
  onCancel: ButtonProps["onClick"];
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
    cancelButton?: ButtonProps;
  };
}

const formSchema = z.object({
  status: z.enum(EJobStatus).default(EJobStatus.Lead),
  categories: z
    .array(z.enum(EJobCategory))
    .min(1, "At least one category is required"),
  description: z.string().min(1, "Description is required"),
  recipients: z
    .array(contactSchema)
    .min(1, "At least one recipient is required"),
  representatives: z.array(contactSchema),
  place: googleAutocompleteSuggestionSchema.optional().refine(Boolean, {
    message: "Address is required",
  }),
});

const JobCreateForm: React.FC<IJobCreateFormProps> = ({
  values,
  onSubmit,
  onCancel,
  slotProps,
  ...props
}) => {
  /** Values */

  const confirm = useConfirm();
  const methods = useForm({
    resolver: zodResolver(formSchema),
    values,
    defaultValues: {
      status: EJobStatus.Lead,
      categories: [],
      description: "",
      recipients: [],
      representatives: [],
      place: undefined,
    },
  });

  /** Data */

  const isDirty = methods.formState.isDirty;
  const isDisabled = methods.formState.disabled;
  const isSubmitting =
    methods.formState.isValid && methods.formState.isSubmitting;
  const isFieldDisabled = isDisabled || isSubmitting;

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit(onSubmit);

  /** Effects */

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
        e.stopPropagation();
        handleOnSubmit(e);
      }}
      {...props}
    >
      <Stack spacing={2} mb={2} {...slotProps?.fields}>
        <Controller
          name="status"
          control={methods.control}
          render={({ field: { value, onChange, ...field } }) => (
            <FormControl
              required
              fullWidth
              error={!!methods.formState.errors.status}
              disabled={isFieldDisabled}
              {...field}
            >
              <InputLabel id="job-status-label">Status</InputLabel>
              <Select
                id="job-status"
                labelId="job-status-label"
                value={value}
                disabled={isFieldDisabled}
                input={<OutlinedInput label="Status" />}
                renderValue={(selected) => <JobStatusChip value={selected} />}
                onChange={(e) => onChange(e.target.value)}
              >
                {Object.values(EJobStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    <JobStatusChip value={status} />
                  </MenuItem>
                ))}
              </Select>
              {!!methods.formState.errors.status && (
                <FormHelperText error>
                  {methods.formState.errors.status.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
        <Controller
          name="categories"
          control={methods.control}
          render={({ field: { value, onChange, ...field } }) => (
            <FormControl
              required
              fullWidth
              error={!!methods.formState.errors.categories}
              disabled={isFieldDisabled}
              {...field}
            >
              <InputLabel id="job-categories-label">Categories</InputLabel>
              <Select
                id="job-categories"
                labelId="job-categories-label"
                multiple
                value={value}
                disabled={isFieldDisabled}
                input={<OutlinedInput label="Categories" />}
                onChange={(e) => onChange(e.target.value as EJobCategory[])}
              >
                {Object.values(EJobCategory).map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {!!methods.formState.errors.categories && (
                <FormHelperText error>
                  {methods.formState.errors.categories.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
        <Controller
          name="recipients"
          control={methods.control}
          render={({ field: { value, onChange, ...field } }) => (
            <ContactAutocomplete
              value={contactSchema.array().parse(value)}
              label="Recipient(s)"
              required
              multiple
              disabled={isFieldDisabled}
              error={!!methods.formState.errors.recipients}
              enableCreate
              helperText={methods.formState.errors.recipients?.message}
              onChange={(_, newValue) => onChange(newValue)}
              {...field}
            />
          )}
        />
        <Controller
          name="place"
          control={methods.control}
          render={({ field: { value, onChange, ...field }, formState }) => (
            <GoogleAutocompleteSuggestionAutocomplete
              label="Address"
              value={value || null}
              required
              disabled={isFieldDisabled}
              error={!!formState.errors.place}
              helperText={formState.errors.place?.message}
              onChange={(_, newValue) => onChange(newValue || undefined)}
              {...field}
            />
          )}
        />
        <TextField
          label="Description"
          multiline
          minRows={3}
          required
          disabled={isFieldDisabled}
          error={!!methods.formState.errors.description}
          helperText={methods.formState.errors.description?.message}
          placeholder="Description of requested work"
          fullWidth
          {...methods.register("description")}
        />
        <Divider />
        <Controller
          name="representatives"
          control={methods.control}
          render={({ field: { value, onChange, ...field } }) => (
            <ContactAutocomplete
              value={contactSchema.array().parse(value)}
              label="Representative(s)"
              multiple
              disabled={isFieldDisabled}
              error={!!methods.formState.errors.representatives}
              helperText={methods.formState.errors.representatives?.message}
              onChange={(_, newValue) => onChange(newValue)}
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
        <Button
          variant="text"
          color="error"
          disabled={isFieldDisabled}
          children="Cancel"
          onClick={onCancel}
          {...slotProps?.cancelButton}
        />
        <Button
          type="submit"
          disabled={isDisabled}
          loading={isSubmitting}
          children="Submit"
          {...slotProps?.submitButton}
        />
      </Stack>
    </Stack>
  );
};

export default JobCreateForm;
