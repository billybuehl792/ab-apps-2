import { type ComponentProps } from "react";
import { Controller } from "react-hook-form";
import { Stack, TextField } from "@mui/material";
import Form from "@/components/forms/Form";
import EmailField from "@/components/fields/EmailField";
import PhoneField from "@/components/fields/PhoneField";
import PlaceAutocompleteField from "@/containers/fields/PlaceAutocompleteField";
import { RegexPattern } from "@/store/constants/regex";
import type { PlaceBasic } from "@/store/types/places";

export interface ClientFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phonePrimary: string;
  phoneSecondary: string | null;
  place: PlaceBasic | null;
}

type ClientFormProps<T = void> = Omit<
  ComponentProps<typeof Form<ClientFormValues, T>>,
  "renderFields"
>;

const DEFAULT_VALUES: ClientFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phonePrimary: "",
  phoneSecondary: "",
  place: null,
};

const ClientForm = <T,>(props: ClientFormProps<T>) => {
  return (
    <Form
      defaultValues={DEFAULT_VALUES}
      renderFields={(methods) => (
        <>
          <Stack direction="row" spacing={1}>
            <TextField
              label="First Name"
              fullWidth
              required
              error={!!methods.formState.errors.firstName}
              helperText={methods.formState.errors.firstName?.message}
              {...methods.register("firstName", {
                required: "This field is required",
                maxLength: { value: 100, message: "Max length is 100" },
              })}
            />
            <TextField
              label="Last Name"
              fullWidth
              required
              error={!!methods.formState.errors.lastName}
              helperText={methods.formState.errors.lastName?.message}
              {...methods.register("lastName", {
                required: "This field is required",
                maxLength: { value: 100, message: "Max length is 100" },
              })}
            />
          </Stack>
          <EmailField
            label="Email"
            fullWidth
            required
            error={!!methods.formState.errors.email}
            helperText={methods.formState.errors.email?.message}
            {...methods.register("email", {
              required: "This field is required",
              pattern: { value: RegexPattern.Email, message: "Invalid email" },
            })}
          />
          <PhoneField
            label="Phone"
            fullWidth
            required
            error={!!methods.formState.errors.phonePrimary}
            helperText={methods.formState.errors.phonePrimary?.message}
            {...methods.register("phonePrimary", {
              required: "This field is required",
              pattern: {
                value: RegexPattern.Phone,
                message: "Invalid phone number",
              },
            })}
          />
          <PhoneField
            label="Phone Secondary"
            fullWidth
            error={!!methods.formState.errors.phoneSecondary}
            helperText={methods.formState.errors.phoneSecondary?.message}
            {...methods.register("phoneSecondary", {
              pattern: {
                value: RegexPattern.Phone,
                message: "Invalid phone number",
              },
            })}
          />
          <Controller
            name="place"
            control={methods.control}
            render={({ field, formState }) => (
              <PlaceAutocompleteField
                label="Address"
                error={!!formState.errors.place}
                helperText={formState.errors.place?.message}
                {...field}
              />
            )}
          />
        </>
      )}
      {...props}
    />
  );
};

export default ClientForm;
