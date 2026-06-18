import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  Container,
  type ContainerProps,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import { router } from "@/main";
import contactEndpoints from "@/store/apps/contacts/contact/endpoints";
import ContactMenuOptionIconButton from "@/containers/buttons/ContactMenuOptionIconButton";
import ContactDetailCard from "@/containers/cards/ContactDetailCard";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import { sxUtils } from "@/store/utils/sx";
import { EContactOptionId } from "@/store/enums/contacts";
import { EObjectChangeType } from "@/store/enums/api";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/contacts/$id/")({
  loader: ({ context }): TRouteLoaderData => {
    return {
      slotProps: {
        pageHeader: {
          endContent: (
            <ContactMenuOptionIconButton
              contact={context.contact}
              hideOptions={[EContactOptionId.Detail]}
              onChange={(_, type) => {
                if (type === EObjectChangeType.Delete)
                  router.navigate({ to: "/app/contacts" });
              }}
            />
          ),
        },
      },
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [tabValue, setTabValue] = useState(0);

  /** Values */

  const context = Route.useRouteContext();

  return (
    <Stack height="100%">
      <Container>
        <Stack spacing={1} py={2}>
          <ContactDetailCard contact={context.contact} />
          <Stack spacing={2}>
            <Tabs
              value={tabValue}
              variant="scrollable"
              scrollButtons={false}
              onChange={(_, newValue) => setTabValue(newValue)}
            >
              <Tab label="Documents" />
              <Tab label="History" />
            </Tabs>
          </Stack>
        </Stack>
      </Container>
      {tabValue === 0 && <FilesTab />}
    </Stack>
  );
}

const FilesTab: React.FC<ContainerProps> = ({ sx, ...props }) => {
  /** Values */

  const snackbar = useSnackbar();
  const context = Route.useRouteContext();

  const uploadMutation = useMutation({
    mutationKey: ["uploadDocument", context.contact.id],
    mutationFn: contactEndpoints.documents.post,
    onSuccess: () =>
      snackbar.enqueueSnackbar("Upload successful", { variant: "success" }),
    onError: () =>
      snackbar.enqueueSnackbar("Upload failed", { variant: "error" }),
  });

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) =>
        uploadMutation.mutate(
          { id: String(context.contact.id), file },
          { onSuccess: () => router.invalidate() },
        ),
      );
    },
  });

  return (
    <Container
      {...props}
      sx={[
        { display: "flex", flexGrow: 1, overflow: "auto" },
        ...sxUtils.asArray(sx),
      ]}
    >
      <Stack
        {...getRootProps()}
        sx={[
          { flexGrow: 1, mb: 2 },
          isDragActive && { bgcolor: "rgba(0,0,0,0.05)" },
        ]}
      >
        {context.contact.documents.map((document) => (
          <Card key={document}>
            <CardContent>{document}</CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};
