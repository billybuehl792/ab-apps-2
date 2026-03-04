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
import { clientUpdateSchema } from "@/store/schemas/clients";
import { errorUtils } from "@/store/utils/error";
import type { TClient, TClientUpdate } from "@/store/types/clients";

interface IClientUpdateFormProps extends Omit<
  StackProps<"form">,
  "onSubmit" | "onReset"
> {
  client: TClient;
  onSubmit: SubmitHandler<TClientUpdate>;
  onSubmitInvalid?: SubmitErrorHandler<TClientUpdate>;
  onFormStateChange?: (formState: FormState<TClientUpdate>) => void;
  slotProps?: {
    fields?: StackProps;
    actions?: StackProps;
    submitButton?: ButtonProps;
  };
}

const ClientUpdateForm: React.FC<IClientUpdateFormProps> = ({
  client,
  onSubmit,
  onSubmitInvalid,
  onFormStateChange,
  slotProps,
  ...props
}) => {
  /** Values */

  const methods = useForm({
    resolver: zodResolver(clientUpdateSchema),
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
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email,
      phone_primary: client.phone_primary,
      phone_secondary: client.phone_secondary ?? "",
      place: client.place,
    });
  }, [client]);

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
      <Stack direction="row" justifyContent="end" {...slotProps?.actions}>
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

export default ClientUpdateForm;
