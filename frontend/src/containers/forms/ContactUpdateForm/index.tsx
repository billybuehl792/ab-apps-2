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
import PhoneField from "@/components/fields/PhoneField";
import GoogleAutocompleteSuggestionListAutocomplete from "@/containers/fields/GoogleAutocompleteSuggestionListAutocomplete";
import { contactUpdateSchema } from "@/store/schemas/contacts";
import { errorUtils } from "@/store/utils/error";
import useConfirm from "@/store/hooks/useConfirm";
import useContact from "@/store/hooks/useContact";
import type { TContact } from "@/store/types/contacts";

interface IContactUpdateFormProps extends Omit<
  StackProps<"form">,
  "onSubmit" | "onReset"
> {
  contact: TContact;
  onSuccess: (contact: TContact) => void;
  onCancel: ButtonProps["onClick"];
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
    cancelButton?: ButtonProps;
  };
}

const ContactUpdateForm: React.FC<IContactUpdateFormProps> = ({
  contact,
  onSuccess,
  onCancel,
  slotProps,
  ...props
}) => {
  /** Values */

  const confirm = useConfirm();
  const contactHook = useContact(contact);
  const methods = useForm({ resolver: zodResolver(contactUpdateSchema) });

  /** Mutations */

  const updateContactMutation = contactHook.mutations.update;

  /** Data */

  const isDirty = methods.formState.isDirty;
  const isSubmitting = updateContactMutation.isPending;
  const isDisabled = methods.formState.disabled;
  const isFieldDisabled = isDisabled || isSubmitting;

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit((data) => {
    updateContactMutation.mutate(data, {
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
    methods.reset({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone_primary: contact.phone_primary,
      phone_secondary: contact.phone_secondary,
      place: contact.place,
    });
  }, [contact]);

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
        <Stack direction="row" spacing={1}>
          <TextField
            label="First Name"
            required
            disabled={isFieldDisabled}
            error={!!methods.formState.errors.first_name}
            helperText={methods.formState.errors.first_name?.message}
            fullWidth
            {...methods.register("first_name")}
          />
          <TextField
            label="Last Name"
            required
            disabled={isFieldDisabled}
            error={!!methods.formState.errors.last_name}
            helperText={methods.formState.errors.last_name?.message}
            fullWidth
            {...methods.register("last_name")}
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
          error={!!methods.formState.errors.phone_primary}
          helperText={methods.formState.errors.phone_primary?.message}
          {...methods.register("phone_primary")}
        />
        <PhoneField
          label="Phone Secondary"
          disabled={isFieldDisabled}
          error={!!methods.formState.errors.phone_secondary}
          helperText={methods.formState.errors.phone_secondary?.message}
          {...methods.register("phone_secondary", {
            setValueAs: (value) => value || null,
          })}
        />
        <Controller
          name="place"
          control={methods.control}
          render={({ field: { value, ...field }, formState }) => (
            <GoogleAutocompleteSuggestionListAutocomplete
              label="Address"
              disabled={isFieldDisabled}
              error={!!formState.errors.place}
              helperText={formState.errors.place?.message}
              value={value}
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

export default ContactUpdateForm;
