import { type ComponentProps } from "react";
import { Stack } from "@mui/material";
import Form from "@/components/forms/Form";
import ClientListParamsFormOrderingHead from "./layout/ClientListParamsFormOrderingHead";
import ClientListParamsFormFiltersHead from "./layout/ClientListParamsFormFiltersHead";
import ClientListParamsFormOrderingField from "./fields/ClientListParamsFormOrderingField";
import ClientListParamsFormWorkOrdersStatusField from "./fields/ClientListParamsFormWorkOrdersStatusField";
import ClientListParamsFormCityField from "./fields/ClientListParamsFormCityField";
import type { ClientListRequestParams } from "@/store/types/clients";

export type ClientListParamsFormValues = ClientListRequestParams;

const ClientListParamsForm = (
  props: ComponentProps<typeof Form<ClientListParamsFormValues>>
) => {
  return (
    <Form {...props}>
      {/* Ordering */}
      <ClientListParamsFormOrderingHead />
      <Stack spacing={2}>
        <ClientListParamsFormOrderingField />
      </Stack>

      {/* Filters */}
      <ClientListParamsFormFiltersHead />
      <Stack spacing={2}>
        <ClientListParamsFormCityField />
        <ClientListParamsFormWorkOrdersStatusField />
      </Stack>
    </Form>
  );
};

export default ClientListParamsForm;
