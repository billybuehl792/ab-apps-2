import { type ComponentProps } from "react";
import { Stack, TextField } from "@mui/material";
import Form from "@/components/forms/Form";
import EmailField from "@/components/fields/EmailField";
import PhoneField from "@/components/fields/PhoneField";
import PlaceAutocompleteField from "@/containers/fields/PlaceAutocompleteField";
import { RegexPattern } from "@/store/constants/regex";
import { Place } from "@/store/types/places";

export interface ClientUpdateFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone_primary: string;
  phone_secondary: string | null;
  place: Place | null;
}

type ClientUpdateFormProps<T = void> = Omit<
  ComponentProps<typeof Form<ClientUpdateFormValues, T>>,
  "children" | "renderFields"
>;

const DEFAULT_VALUES: ClientUpdateFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone_primary: "",
  phone_secondary: "",
  place: null,
};

const ClientUpdateForm = <T,>(props: ClientUpdateFormProps<T>) => {
  return (
    <Form
      defaultValues={DEFAULT_VALUES}
      onReset={(methods) => methods.reset(DEFAULT_VALUES)}
      renderFieldset={(methods) => (
        <Stack spacing={2} pb={2}>
          <Stack direction="row" spacing={1}>
            <TextField
              label="First Name"
              fullWidth
              required
              error={!!methods.formState.errors.first_name}
              helperText={methods.formState.errors.first_name?.message}
              {...methods.register("first_name", {
                required: "This field is required",
                maxLength: {
                  value: 100,
                  message: "Max length is 100",
                },
              })}
            />
            <TextField
              label="Last Name"
              fullWidth
              required
              error={!!methods.formState.errors.last_name}
              helperText={methods.formState.errors.last_name?.message}
              {...methods.register("last_name", {
                required: "This field is required",
                maxLength: {
                  value: 100,
                  message: "Max length is 100",
                },
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
              pattern: {
                value: RegexPattern.Email,
                message: "Invalid email",
              },
            })}
          />
          <PhoneField
            label="Phone"
            fullWidth
            required
            error={!!methods.formState.errors.phone_primary}
            helperText={methods.formState.errors.phone_primary?.message}
            {...methods.register("phone_primary", {
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
            error={!!methods.formState.errors.phone_secondary}
            helperText={methods.formState.errors.phone_secondary?.message}
            {...methods.register("phone_secondary", {
              pattern: {
                value: RegexPattern.Phone,
                message: "Invalid phone number",
              },
            })}
          />
          <PlaceAutocompleteField
            label="Address"
            required
            error={!!methods.formState.errors.place}
            helperText={methods.formState.errors.place?.message}
            {...methods.register("place", {
              required: "This field is required",
            })}
          />
        </Stack>
      )}
      {...props}
    />
  );
};

export default ClientUpdateForm;
