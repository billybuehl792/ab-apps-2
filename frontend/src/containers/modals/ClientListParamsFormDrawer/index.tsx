import React, { type ComponentProps } from "react";
import Drawer from "@/components/modals/Drawer";
import ClientListParamsForm from "@/containers/forms/ClientListParamsForm";

type ClientListParamsFormDrawerProps = ComponentProps<typeof Drawer> &
  Pick<ComponentProps<typeof ClientListParamsForm>, "values" | "onChange">;

const ClientListParamsFormDrawer: React.FC<ClientListParamsFormDrawerProps> = ({
  values,
  onChange,
  ...props
}) => {
  return (
    <Drawer title="Client List Options" {...props}>
      <ClientListParamsForm values={values} onChange={onChange} />
    </Drawer>
  );
};

export default ClientListParamsFormDrawer;
