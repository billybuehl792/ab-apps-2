import { type ComponentProps } from "react";
import { type AxiosResponse } from "axios";
import { Stack } from "@mui/material";
import Form from "@/components/forms/Form";
import ClientFormFirstNameField from "./fields/ClientFormFirstNameField";
import ClientFormLastNameField from "./fields/ClientFormLastNameField";
import ClientFormEmailField from "./fields/ClientFormEmailField";
import ClientFormPhonePrimaryField from "./fields/ClientFormPhonePrimaryField";
import ClientFormPhoneSecondaryField from "./fields/ClientFormPhoneSecondaryField";
import ClientFormPlaceField from "./fields/ClientFormPlaceField";
import type { Client, ClientWriteable } from "@/store/types/clients";

export type ClientFormValues = Omit<Client, "id">;

const ClientForm = (
  props: ComponentProps<
    typeof Form<ClientFormValues, AxiosResponse<ClientWriteable>>
  >
) => {
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
