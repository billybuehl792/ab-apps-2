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
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneField from "@/components/fields/PhoneField";
import GoogleAutocompleteSuggestionListAutocomplete from "@/containers/fields/GoogleAutocompleteSuggestionListAutocomplete";
import { contactUpdateSchema } from "@/store/schemas/contacts";
import { errorUtils } from "@/store/utils/error";
import type { TContact, TContactUpdate } from "@/store/types/contacts";

interface IContactUpdateFormProps extends Omit<
  StackProps<"form">,
  "onSubmit" | "onReset"
> {
  contact: TContact;
  onSubmit: SubmitHandler<TContactUpdate>;
  onSubmitInvalid?: SubmitErrorHandler<TContactUpdate>;
  onFormStateChange?: (formState: FormState<TContactUpdate>) => void;
  onCancel?: ButtonProps["onClick"];
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
    cancelButton?: ButtonProps;
  };
}

const ContactUpdateForm: React.FC<IContactUpdateFormProps> = ({
  contact,
  onSubmit,
  onSubmitInvalid,
  onFormStateChange,
  onCancel,
  slotProps,
  ...props
}) => {
  /** Values */

  const methods = useForm({
    resolver: zodResolver(contactUpdateSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_primary: "",
      phone_secondary: "",
      place: null,
    },
  });

  const isFieldDisabled =
    methods.formState.disabled || methods.formState.isSubmitting;

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
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
    methods.reset({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone_primary: contact.phone_primary,
      phone_secondary: contact.phone_secondary ?? "",
      place: contact.place,
    });
  }, [contact]);

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

export default ContactUpdateForm;
