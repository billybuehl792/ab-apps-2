import { createFileRoute } from "@tanstack/react-router";
import { Container, Stack, Typography } from "@mui/material";
import ListCard from "@/components/cards/ListCard";
import { JobIcons } from "@/store/constants/jobs";
import { ContactIcons } from "@/store/constants/contacts";
import { PlaceIcons } from "@/store/constants/places";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
  beforeLoad: () => ({ crumb: null }),
});

function RouteComponent() {
  return (
    <Container>
      <Stack spacing={2} my={2}>
        <Typography variant="h5">Welcome to AB Apps</Typography>
        <Stack spacing={1}>
          <ListCard
            startContent={<JobIcons.List fontSize="large" color="disabled" />}
            label="Jobs"
            description="Manage your Jobs and Tasks"
            link={{ to: "/app/jobs" }}
          />
          <ListCard
            startContent={
              <ContactIcons.List fontSize="large" color="disabled" />
            }
            label="Contacts"
            description="Manage your Contacts"
            link={{ to: "/app/contacts" }}
          />
          <ListCard
            startContent={<PlaceIcons.List fontSize="large" color="disabled" />}
            label="Places"
            description="Manage your Places"
            link={{ to: "/app/places" }}
          />
        </Stack>
      </Stack>
    </Container>
  );
}
