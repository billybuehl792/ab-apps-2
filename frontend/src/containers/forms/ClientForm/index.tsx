import { type ComponentProps } from "react";
import { Stack } from "@mui/material";
import Form from "@/components/forms/Form";
import ClientFormFirstNameField from "./fields/ClientFormFirstNameField";
import ClientFormLastNameField from "./fields/ClientFormLastNameField";
import ClientFormEmailField from "./fields/ClientFormEmailField";
import ClientFormPhonePrimaryField from "./fields/ClientFormPhonePrimaryField";
import ClientFormPhoneSecondaryField from "./fields/ClientFormPhoneSecondaryField";
import type { Client } from "@/store/types";

export type ClientForm = Omit<Client, "id">;

const ClientForm = (props: ComponentProps<typeof Form<ClientForm, Client>>) => {
  return (
    <Form {...props}>
      <Stack direction="row" spacing={1}>
        <ClientFormFirstNameField />
        <ClientFormLastNameField />
      </Stack>
      <ClientFormEmailField />
      <ClientFormPhonePrimaryField />
      <ClientFormPhoneSecondaryField />
    </Form>
  );
};

export default ClientForm;
