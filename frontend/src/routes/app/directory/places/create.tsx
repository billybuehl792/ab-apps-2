import { type ComponentProps } from "react";
import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import { PlaceIcons } from "@/store/constants/places";
import PlaceCreateForm from "@/containers/forms/PlaceCreateForm";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/directory/places/create")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Create Place", Icon: PlaceIcons.Create },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();

  /** Callbacks */

  const handleOnSuccess: ComponentProps<typeof PlaceCreateForm>["onSuccess"] = (
    newPlace,
  ) =>
    navigate({
      to: "/app/directory/places/$id",
      params: { id: String(newPlace.id) },
      ignoreBlocker: true,
    });

  const handleOnCancel = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/app/directory/places" });
  };

  return (
    <Stack spacing={2} my={2}>
      <Typography variant="h5">Create New Place</Typography>
      <PlaceCreateForm onSuccess={handleOnSuccess} onCancel={handleOnCancel} />
    </Stack>
  );
}
