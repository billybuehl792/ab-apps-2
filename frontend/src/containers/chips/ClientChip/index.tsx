import { Chip, Skeleton, type ChipProps } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Person } from "@mui/icons-material";
import { clientQueries } from "@/store/queries/clients";
import type { Client } from "@/store/types/clients";

interface ClientChipProps extends ChipProps {
  client: Client | Client["id"];
}

const ClientChip = ({ client: clientProp, ...props }: ClientChipProps) => {
  /** Values */

  const isId = !(clientProp instanceof Object);
  const clientId = isId ? clientProp : clientProp.id;

  /** Queries */

  const clientQuery = useQuery({
    ...clientQueries.detail(clientId),
    enabled: isId,
  });

  /** Data */

  const client = isId ? clientQuery.data : clientProp;
  const label = clientQuery.isError
    ? "error"
    : client
      ? `${client.first_name} ${client.last_name}`
      : "-";

  return (
    <Chip
      icon={<Person fontSize={props.size} />}
      label={
        clientQuery.isLoading ? <Skeleton height={24} width={100} /> : label
      }
      {...props}
    />
  );
};

export default ClientChip;
