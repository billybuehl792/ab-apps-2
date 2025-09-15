import { type ComponentProps } from "react";
import { Stack } from "@mui/material";
import Form from "@/components/forms/Form";
import ClientApiListRequestFormOrderingHead from "./layout/ClientApiListRequestFormOrderingHead";
import ClientApiListRequestFormFiltersHead from "./layout/ClientApiListRequestFormFiltersHead";
import ClientApiListRequestFormOrderingField from "./fields/ClientApiListRequestFormOrderingField";
import ClientApiListRequestFormWorkOrdersStatusField from "./fields/ClientApiListRequestFormWorkOrdersStatusField";
import type { ClientApiListRequest } from "@/store/types/clients";

export type ClientApiListRequestFormValues = ClientApiListRequest;

const ClientApiListRequestForm = (
  props: ComponentProps<typeof Form<ClientApiListRequestFormValues>>
) => {
  return (
    <Form {...props}>
      <Stack px={2}>
        {/* Ordering */}
        <ClientApiListRequestFormOrderingHead />
        <Stack spacing={2} ml={2} py={1}>
          <ClientApiListRequestFormOrderingField />
        </Stack>

        {/* Filters */}
        <ClientApiListRequestFormFiltersHead />
        <Stack spacing={2} ml={2} py={3}>
          <ClientApiListRequestFormWorkOrdersStatusField />
        </Stack>
      </Stack>
    </Form>
  );
};

export default ClientApiListRequestForm;
