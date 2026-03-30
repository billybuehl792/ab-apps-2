import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mui/material";
import ListCard from "@/components/cards/ListCard";
import { contactEndpoints, ContactIcons } from "@/store/constants/contacts";
import { placeEndpoints, PlaceIcons } from "@/store/constants/places";

export const Route = createFileRoute("/app/directory/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Queries */

  const contactListQuery = useQuery({
    queryKey: contactEndpoints.id,
    queryFn: () => contactEndpoints.get(),
  });
  const placeListQuery = useQuery({
    queryKey: placeEndpoints.id,
    queryFn: () => placeEndpoints.get(),
  });

  return (
    <Stack spacing={1} my={2}>
      <ListCard
        startContent={<ContactIcons.List fontSize="large" color="disabled" />}
        label="Contacts"
        description={`Total: ${contactListQuery.data?.count ?? "-"}`}
        link={{ to: "/app/directory/contacts" }}
      />
      <ListCard
        startContent={<PlaceIcons.List fontSize="large" color="disabled" />}
        label="Places"
        description={`Total: ${placeListQuery.data?.count ?? "-"}`}
        link={{ to: "/app/directory/places" }}
      />
    </Stack>
  );
}
