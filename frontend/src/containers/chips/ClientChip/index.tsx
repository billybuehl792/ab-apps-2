import { Chip, type ChipProps } from "@mui/material";
import { Person } from "@mui/icons-material";
import type { Client } from "@/store/types";

interface ClientChipProps extends ChipProps {
  client: Client;
}

const ClientChip = ({ client, ...props }: ClientChipProps) => {
  /** Values */

  const fullname = `${client.first_name} ${client.last_name}`;

  return (
    <Chip icon={<Person />} label={fullname} variant="outlined" {...props} />
  );
};

export default ClientChip;
