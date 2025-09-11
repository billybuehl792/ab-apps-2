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
import { Work } from "@mui/icons-material";
import { workOrderQueries } from "@/store/queries/work-orders";

const WorkOrderCountCard = (props: CardProps) => {
  /** Queries */

  const workOrderCountQuery = useQuery(workOrderQueries.count());

  return (
    <Card {...props}>
      <CardActionArea LinkComponent={Link} href="/app/work-orders/">
        <Stack
          component={CardContent}
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Work fontSize="large" color="disabled" />
          <Stack>
            <Typography variant="body1">Work Orders</Typography>
            <Typography variant="caption" color="text.secondary">
              Total: {workOrderCountQuery?.data?.count ?? "-"}
            </Typography>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export default WorkOrderCountCard;
