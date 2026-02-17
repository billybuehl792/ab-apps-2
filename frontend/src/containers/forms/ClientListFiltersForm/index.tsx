import { Stack, type StackProps } from "@mui/material";
import { clientListRequestParamsSchema } from "@/store/schemas/clients";
import ClientListFiltersFormCityField from "./fields/ClientListFiltersFormCityField";
import ClientListFiltersFormWorkOrderStatusField from "./fields/ClientListFiltersFormWorkOrderStatusField";
import type { ClientListRequestParams } from "@/store/types/clients";

interface ClientListFiltersFormProps extends Omit<StackProps, "onChange"> {
  values: ClientListRequestParams;
  onChange: (values: ClientListRequestParams) => void;
}

const ClientListFiltersForm: React.FC<ClientListFiltersFormProps> = ({
  values: valuesProp,
  onChange,
  ...props
}) => {
  /** Values */

  const values = clientListRequestParamsSchema.parse(valuesProp);

  /** Callbacks */

  const handleOnChange = (values: ClientListRequestParams) =>
    onChange(clientListRequestParamsSchema.parse(values));

  return (
    <Stack spacing={2} {...props}>
      <ClientListFiltersFormCityField
        value={values.city ?? []}
        onChange={(_event, value) => handleOnChange({ ...values, city: value })}
      />
      <ClientListFiltersFormWorkOrderStatusField
        value={values.work_order_status ?? []}
        onChange={(value) =>
          handleOnChange({ ...values, work_order_status: value })
        }
      />
    </Stack>
  );
};

export default ClientListFiltersForm;
