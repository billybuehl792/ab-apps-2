import { Chip, Skeleton, type ChipProps } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Person } from "@mui/icons-material";
import { clientEndpoints } from "@/store/constants/clients";
import type { TClientBasic } from "@/store/types/clients";

interface ClientChipProps extends ChipProps {
  client: TClientBasic | number;
}

const DEFAULT_LABEL = "-";

const ClientChip = ({ client: clientProp, ...props }: ClientChipProps) => {
  /** Values */

  const isId = typeof clientProp === "number";
  const clientId = isId ? clientProp : clientProp.id;

  /** Queries */

  const clientQuery = useQuery({
    queryKey: clientEndpoints.client(clientId).id,
    queryFn: clientEndpoints.client(clientId).get,
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
