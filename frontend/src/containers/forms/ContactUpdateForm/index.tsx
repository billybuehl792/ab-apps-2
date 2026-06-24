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
} from "@mui/material";
import PhoneField from "@/components/fields/PhoneField";
import GoogleAutocompleteSuggestionAutocomplete from "@/containers/fields/GoogleAutocompleteSuggestionAutocomplete";
import useConfirm from "@/store/hooks/useConfirm";
import { phoneSchema } from "@/store/schemas/basic";
import { googleAutocompleteSuggestionSchema } from "@/store/schemas/places";

type TContactUpdateFormValues = z.infer<typeof formSchema>;

export interface IContactUpdateFormProps extends Omit<
  StackProps<"form">,
  "component" | "onSubmit" | "onReset"
> {
  values: TContactUpdateFormValues;
  onSubmit: SubmitHandler<TContactUpdateFormValues>;
  onCancel: ButtonProps["onClick"];
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
    cancelButton?: ButtonProps;
  };
}

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  phonePrimary: phoneSchema,
  phoneSecondary: phoneSchema.nullable(),
  place: googleAutocompleteSuggestionSchema.nullable(),
});

const ContactUpdateForm: React.FC<IContactUpdateFormProps> = ({
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
      firstName: "",
      lastName: "",
      email: "",
      phonePrimary: "",
      phoneSecondary: null,
      place: null,
    },
  });

  /** Data */

  const isDirty = methods.formState.isDirty;
  const isDisabled = methods.formState.disabled;
  const isSubmitDisabled = isDisabled || !isDirty;
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
        {!!methods.formState.errors.root && (
          <FormHelperText error>
            {methods.formState.errors.root?.message}
          </FormHelperText>
        )}
        <Stack direction="row" spacing={1}>
          <TextField
            label="First Name"
            required
            disabled={isFieldDisabled}
            error={!!methods.formState.errors.firstName}
            helperText={methods.formState.errors.firstName?.message}
            fullWidth
            {...methods.register("firstName")}
          />
          <TextField
            label="Last Name"
            required
            disabled={isFieldDisabled}
            error={!!methods.formState.errors.lastName}
            helperText={methods.formState.errors.lastName?.message}
            fullWidth
            {...methods.register("lastName")}
          />
        </Stack>
        <TextField
          label="Email Address"
          placeholder="example@email.com"
          required
          disabled={isFieldDisabled}
          error={!!methods.formState.errors.email}
          helperText={methods.formState.errors.email?.message}
          {...methods.register("email")}
        />
        <PhoneField
          label="Phone Primary"
          required
          disabled={isFieldDisabled}
          error={!!methods.formState.errors.phonePrimary}
          helperText={methods.formState.errors.phonePrimary?.message}
          {...methods.register("phonePrimary")}
        />
        <PhoneField
          label="Phone Secondary"
          disabled={isFieldDisabled}
          error={!!methods.formState.errors.phoneSecondary}
          helperText={methods.formState.errors.phoneSecondary?.message}
          {...methods.register("phoneSecondary", {
            setValueAs: (value) => value || null,
          })}
        />
        <Controller
          name="place"
          control={methods.control}
          render={({ field: { onChange, ...field }, formState }) => (
            <GoogleAutocompleteSuggestionAutocomplete
              disabled={isFieldDisabled}
              error={!!formState.errors.place}
              helperText={formState.errors.place?.message}
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
          disabled={isSubmitDisabled}
          loading={isSubmitting}
          children="Submit"
          {...slotProps?.submitButton}
        />
      </Stack>
    </Stack>
  );
};

export default ContactUpdateForm;
