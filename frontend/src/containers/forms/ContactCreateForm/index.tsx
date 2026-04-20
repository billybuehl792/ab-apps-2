import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useBlocker } from "@tanstack/react-router";
import {
  Button,
  type ButtonProps,
  Stack,
  TextField,
  type StackProps,
  FormHelperText,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneField from "@/components/fields/PhoneField";
import GoogleAutocompleteSuggestionAutocomplete from "@/containers/fields/GoogleAutocompleteSuggestionAutocomplete";
import useContact from "@/store/hooks/useContact";
import useConfirm from "@/store/hooks/useConfirm";
import { contactCreateSchema } from "@/store/schemas/contacts";
import { errorUtils } from "@/store/utils/error";
import { NULL_ID } from "@/store/constants/api";
import type { TContact, TContactCreate } from "@/store/types/contacts";

interface IContactCreateFormProps extends Omit<
  StackProps<"form">,
  "component" | "onSubmit" | "onReset"
> {
  initialValues?: Partial<TContactCreate>;
  onSuccess: (contact: TContact) => void;
  onCancel: ButtonProps["onClick"];
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
    cancelButton?: ButtonProps;
  };
}

const DEFAULT_VALUES: TContactCreate = {
  first_name: "",
  last_name: "",
  email: "",
  phone_primary: "",
  phone_secondary: null,
  place: null,
};

const ContactCreateForm: React.FC<IContactCreateFormProps> = ({
  initialValues,
  onSuccess,
  onCancel,
  slotProps,
  ...props
}) => {
  /** Values */

  const confirm = useConfirm();
  const contactHook = useContact(NULL_ID);
  const methods = useForm({
    resolver: zodResolver(contactCreateSchema),
    defaultValues: DEFAULT_VALUES,
  });

  /** Mutations */

  const createContactMutation = contactHook.mutations.create;

  /** Data */

  const isDirty = methods.formState.isDirty;
  const isSubmitting = createContactMutation.isPending;
  const isDisabled = methods.formState.disabled;
  const isFieldDisabled = isDisabled || isSubmitting;

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit((data) => {
    createContactMutation.mutate(data, {
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
          render={({ field, formState }) => (
            <GoogleAutocompleteSuggestionAutocomplete
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
        <Button
          variant="text"
          color="error"
          disabled={isDisabled}
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

export default ContactCreateForm;
