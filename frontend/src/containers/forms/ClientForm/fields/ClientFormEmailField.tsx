import { type ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import EmailField from "@/components/fields/EmailField";
import { RegexPattern } from "@/store/utils/regex";
import type { ClientForm } from "..";

const MAX_LENGTH = 128;

const ClientFormEmailField = (props: ComponentProps<typeof EmailField>) => {
  /** Values */

  const methods = useFormContext<ClientForm>();

  return (
    <EmailField
      label="Email"
      required
      error={Boolean(methods.formState.errors.email)}
      helperText={methods.formState.errors.email?.message}
      {...methods.register("email", {
        required: "Email is required",
        maxLength: {
          value: MAX_LENGTH,
          message: `Max length is ${String(MAX_LENGTH)}`,
        },
        pattern: {
          value: RegexPattern.EMAIL,
          message: "Invalid email",
        },
      })}
      {...props}
    />
  );
};

export default ClientFormEmailField;
