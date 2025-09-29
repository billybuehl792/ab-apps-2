import { type ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";
import PhoneField from "@/components/fields/PhoneField";
import { RegexPattern } from "@/store/constants/regex";
import type { ClientFormValues } from "..";

const ClientFormPhoneSecondaryField = (
  props: ComponentProps<typeof PhoneField>
) => {
  /** Values */

  const methods = useFormContext<ClientFormValues>();

  return (
    <Controller
      name="phone_secondary"
      control={methods.control}
      rules={{
        validate: {
          isTel: (value) =>
            !value ||
            !!value.match(RegexPattern.Phone) ||
            "Must be a valid phone number",
        },
      }}
      render={({ field: { value, ...field }, formState }) => (
        <PhoneField
          label="Phone Secondary"
          value={value ?? ""}
          error={Boolean(formState.errors.phone_secondary)}
          helperText={formState.errors.phone_secondary?.message}
          {...props}
          {...field}
        />
      )}
    />
  );
};

export default ClientFormPhoneSecondaryField;
