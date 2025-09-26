import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Container, Stack, Typography } from "@mui/material";
import MentionField from "@/components/fields/MentionField";

export const Route = createFileRoute("/app/sandbox")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const [value, setValue] = useState("");

  return (
    <Container maxWidth="lg">
      <Stack spacing={2} mt={2}>
        <Typography variant="h6">Sandbox</Typography>
        <MentionField value={value} onChange={setValue} />
      </Stack>
    </Container>
  );
}
