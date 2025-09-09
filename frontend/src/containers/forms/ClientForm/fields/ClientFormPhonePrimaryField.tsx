import { type ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";
import PhoneField from "@/components/fields/PhoneField";
import { RegexPattern } from "@/store/constants/regex";
import type { ClientFormValues } from "..";

const ClientFormPhonePrimaryField = (
  props: ComponentProps<typeof PhoneField>
) => {
  /** Values */

  const methods = useFormContext<ClientFormValues>();

  return (
    <Controller
      name="phone_primary"
      control={methods.control}
      rules={{
        required: "Phone number is required",
        validate: {
          isTel: (value) =>
            !!value.match(RegexPattern.PHONE) || "Must be a valid phone number",
        },
      }}
      render={({ field: { value, ...field }, formState }) => (
        <PhoneField
          label="Phone"
          value={value ?? ""}
          required
          error={Boolean(formState.errors.phone_primary)}
          helperText={formState.errors.phone_primary?.message}
          {...props}
          {...field}
        />
      )}
    />
  );
};

export default ClientFormPhonePrimaryField;
