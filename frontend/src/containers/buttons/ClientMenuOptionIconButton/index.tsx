import { type ComponentProps } from "react";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Delete, Info } from "@mui/icons-material";
import { clientMutations } from "@/store/mutations/clients";
import useConfirm from "@/store/hooks/useConfirm";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import type { Client } from "@/store/types";

interface ClientMenuOptionIconButtonProps
  extends Omit<ComponentProps<typeof MenuOptionIconButton>, "options"> {
  client: Client | Client["id"];
}

const ClientMenuOptionIconButton = ({
  client: clientProp,
  ...props
}: ClientMenuOptionIconButtonProps) => {
  /** Values */

  const navigate = useNavigate();
  const confirm = useConfirm();
  const matches = useMatches();

  const clientId = typeof clientProp === "string" ? clientProp : clientProp.id;

  const isDetail = matches.some((m) => m.routeId === "/app/clients/$id");

  /** Mutations */

  const deleteClientMutation = useMutation(clientMutations.delete());

  const options: MenuOption[] = [
    {
      id: "detail",
      render: !isDetail,
      label: "Detail",
      icon: <Info />,
      link: { to: "/app/clients/$id", params: { id: clientId } },
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Delete />,
      color: "error",
      onClick: () =>
        confirm("Delete Client?", () =>
          deleteClientMutation.mutate(clientId, {
            onSuccess: () => navigate({ to: "/app/clients" }),
          })
        ),
    },
  ];

  return <MenuOptionIconButton options={options} {...props} />;
};

export default ClientMenuOptionIconButton;
