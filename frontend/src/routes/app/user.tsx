import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { authQueries } from "@/store/queries/auth";

export const Route = createFileRoute("/app/user")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const queryClient = useQueryClient();

  /** Queries */

  const meQuery = useQuery(authQueries.me());

  /** Callbacks */

  const handleInvalidateMe = () => queryClient.invalidateQueries(meQuery);

  return (
    <Stack spacing={2}>
      {meQuery.isFetching ? (
        <Skeleton />
      ) : (
        <Typography variant="body1">{meQuery.data?.username}</Typography>
      )}
      <Stack direction="row">
        <Button variant="outlined" color="primary" onClick={handleInvalidateMe}>
          Invalidate Me
        </Button>
      </Stack>
    </Stack>
  );
}
