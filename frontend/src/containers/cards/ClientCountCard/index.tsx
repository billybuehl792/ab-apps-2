import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { clientQueries } from "@/store/queries/clients";

const ClientCountCard = (props: CardProps) => {
  /** Queries */

  const clientCountQuery = useQuery(clientQueries.count());

  return (
    <Card {...props}>
      <CardActionArea LinkComponent={Link} href="/app/clients/">
        <Stack
          component={CardContent}
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Person fontSize="large" color="disabled" />
          <Stack>
            <Typography variant="body1">Clients</Typography>
            <Typography variant="caption" color="text.secondary">
              Total: {clientCountQuery?.data?.count ?? "-"}
            </Typography>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export default ClientCountCard;
