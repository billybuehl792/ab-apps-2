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
import GoogleAutocompleteSuggestionAutocomplete from "@/containers/fields/GoogleAutocompleteSuggestionAutocomplete";
import ContactAutocomplete from "@/containers/fields/ContactAutocomplete";
import useConfirm from "@/store/hooks/useConfirm";
import { googleAutocompleteSuggestionSchema } from "@/store/schemas/places";
import { contactSchema } from "@/store/schemas/contacts";
import { EJobCategory } from "@/store/enums/jobs";

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
  categories: z
    .array(z.nativeEnum(EJobCategory))
    .min(1, "At least one category is required"),
  description: z.string().min(1, "Description is required"),
  recipients: z
    .array(contactSchema)
    .min(1, "At least one recipient is required"),
  representatives: z.array(contactSchema),
  place: googleAutocompleteSuggestionSchema,
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
          name="categories"
          control={methods.control}
          render={({ field }) => (
            <FormControl>
              <InputLabel id="job-categories-label" required>
                Categories
              </InputLabel>
              <Select
                id="job-categories"
                labelId="job-categories-label"
                multiple
                value={field.value}
                input={<OutlinedInput label="Categories" />}
                onChange={(e) =>
                  field.onChange(e.target.value as EJobCategory[])
                }
                disabled={isFieldDisabled}
                error={!!methods.formState.errors.categories}
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
          render={({ field: { onChange, ...field } }) => (
            <ContactAutocomplete
              label="Recipient(s)"
              required
              multiple
              disabled={isFieldDisabled}
              error={!!methods.formState.errors.recipients}
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
          render={({ field: { onChange, ...field } }) => (
            <ContactAutocomplete
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
