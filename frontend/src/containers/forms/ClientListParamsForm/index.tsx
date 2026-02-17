import { Stack, type StackProps } from "@mui/material";
import ClientListParamsFormCityField from "./fields/ClientListParamsFormCityField";
import { clientListRequestParamsSchema } from "@/store/schemas/clients";
import type { ClientListRequestParams } from "@/store/types/clients";

interface ClientListParamsFormProps extends Omit<StackProps, "onChange"> {
  values: ClientListRequestParams;
  onChange: (values: ClientListRequestParams) => void;
}

const ClientListParamsForm: React.FC<ClientListParamsFormProps> = ({
  values,
  onChange,
  ...props
}) => {
  /** Values */

  const params = clientListRequestParamsSchema.parse(values);

  /** Callbacks */

  const handleOnChange = (values: ClientListRequestParams) => onChange(values);

  return (
    <Stack {...props}>
      <ClientListParamsFormCityField />
      {/* <ClientListParamsFormWorkOrdersStatusField /> */}
    </Stack>
  );
};

export default ClientListParamsForm;
