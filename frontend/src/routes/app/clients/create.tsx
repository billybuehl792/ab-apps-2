import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button, Stack, TextField } from "@mui/material";
import { clientMutations } from "@/store/mutations/clients";

export const Route = createFileRoute("/app/clients/create")({
  loader: () => ({ crumb: "Create Client" }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate();

  /** Mutations */

  const createClientMutation = useMutation(clientMutations.create());

  /** Callbacks */

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    createClientMutation.mutate(
      {
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phone_primary: formData.get("phonePrimary") as string,
        phone_secondary: "",
        place: null,
      },
      { onSuccess: (data) => navigate({ to: `/app/clients/${data.id}` }) }
    );
  };
  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          name="firstName"
          label="First Name"
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          name="lastName"
          label="Last Name"
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          name="phonePrimary"
          label="Primary Phone"
          type="tel"
          variant="outlined"
          fullWidth
          required
        />
      </Stack>
      <Stack direction="row" justifyContent="end">
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          loading={createClientMutation.isPending}
        >
          Create
        </Button>
      </Stack>
    </Stack>
  );
}
