import { type ComponentProps } from "react";
import { Stack } from "@mui/material";
import Form from "@/components/forms/Form";
import ClientFormFirstNameField from "./fields/ClientFormFirstNameField";
import ClientFormLastNameField from "./fields/ClientFormLastNameField";
import ClientFormEmailField from "./fields/ClientFormEmailField";
import ClientFormPhonePrimaryField from "./fields/ClientFormPhonePrimaryField";
import ClientFormPhoneSecondaryField from "./fields/ClientFormPhoneSecondaryField";
import ClientFormPlaceField from "./fields/ClientFormPlaceField";
import type { Client } from "@/store/types/clients";

export type ClientFormValues = Omit<Client, "id">;

type ClientFormProps<T = void> = Omit<
  ComponentProps<typeof Form<ClientFormValues, T>>,
  "children"
>;

const ClientForm = <T,>(props: ClientFormProps<T>) => {
  return (
    <Form {...props}>
      <Stack direction="row" spacing={1}>
        <ClientFormFirstNameField />
        <ClientFormLastNameField />
      </Stack>
      <ClientFormEmailField />
      <ClientFormPhonePrimaryField />
      <ClientFormPhoneSecondaryField />
      <ClientFormPlaceField />
    </Form>
  );
};

export default ClientForm;
