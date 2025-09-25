import MentionField from "@/components/fields/MentionField";
import { Container, Stack, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/sandbox")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={2} mt={2}>
        <Typography variant="h6">Sandbox</Typography>
        <MentionField />
      </Stack>
    </Container>
  );
}
