import { createFileRoute } from "@tanstack/react-router";
import { Container, Stack, Typography } from "@mui/material";
import { CalendarViewMonth, Groups } from "@mui/icons-material";
import ListCard from "@/components/cards/ListCard";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container maxWidth="md">
      <Stack spacing={2} my={2}>
        <Typography variant="h5">Welcome to AB Apps</Typography>
        <Stack spacing={1}>
          <ListCard
            startContent={<Groups fontSize="large" color="disabled" />}
            label="Directory"
            description="Contacts and Places"
            link={{ to: "/app/directory" }}
          />
          <ListCard
            startContent={
              <CalendarViewMonth fontSize="large" color="disabled" />
            }
            label="Board"
            description="Jobs and Tasks"
            link={{ to: "/app/board" }}
          />
        </Stack>
      </Stack>
    </Container>
  );
}
