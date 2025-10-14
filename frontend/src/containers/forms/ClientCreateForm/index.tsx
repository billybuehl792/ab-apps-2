import { type ComponentProps } from "react";
import { Stack, TextField } from "@mui/material";
import Form from "@/components/forms/Form";
import EmailField from "@/components/fields/EmailField";
import PhoneField from "@/components/fields/PhoneField";
import PlaceAutocompleteField from "@/containers/fields/PlaceAutocompleteField";
import { RegexPattern } from "@/store/constants/regex";
import type { Place } from "@/store/types/places";
import type { Document } from "@/store/types/documents";
import type { WorkOrder } from "@/store/types/work-orders";

export interface ClientCreateFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phonePrimary: string;
  phoneSecondary: string | null;
  place: Place | null;
  documents: Document[];
  workOrders: WorkOrder[];
}

type ClientCreateFormProps<T = void> = Omit<
  ComponentProps<typeof Form<ClientCreateFormValues, T>>,
  "children" | "renderFields"
>;

const DEFAULT_VALUES: ClientCreateFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phonePrimary: "",
  phoneSecondary: "",
  place: null,
  documents: [],
  workOrders: [],
};

const ClientCreateForm = <T,>(props: ClientCreateFormProps<T>) => {
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
              error={!!methods.formState.errors.firstName}
              helperText={methods.formState.errors.firstName?.message}
              {...methods.register("firstName", {
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
              error={!!methods.formState.errors.lastName}
              helperText={methods.formState.errors.lastName?.message}
              {...methods.register("lastName", {
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

export default ClientCreateForm;
