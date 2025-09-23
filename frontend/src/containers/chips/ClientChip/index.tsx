import { Chip, Skeleton, type ChipProps } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Person } from "@mui/icons-material";
import { clientQueries } from "@/store/queries/clients";
import type { ClientBasic } from "@/store/types/clients";

interface ClientChipProps extends ChipProps {
  client: ClientBasic | number;
}

const DEFAULT_LABEL = "-";

const ClientChip = ({ client: clientProp, ...props }: ClientChipProps) => {
  /** Values */

  const isId = typeof clientProp === "number";
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
      ? (client?.full_name ?? DEFAULT_LABEL)
      : DEFAULT_LABEL;

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
