import { type SyntheticEvent } from "react";
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import { z } from "zod";
import contactEndpoints from "@/store/apps/contacts/contact/endpoints";
import ContactMenuOptionIconButton from "@/containers/buttons/ContactMenuOptionIconButton";
import ContactDetailCard from "@/containers/cards/ContactDetailCard";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import { EContactOptionId } from "@/store/enums/contacts";
import { EObjectChangeType } from "@/store/enums/api";

const TABS = ["overview", "documents", "history"] as const;
const paramsSchema = z.object({ tab: z.enum(TABS).catch(TABS[0]) });
const defaultParams = paramsSchema.parse({});

const PageOptionsIconButton: React.FC = () => {
  /** Values */

  const { contact } = Route.useRouteContext();
  const navigate = useNavigate();

  return (
    <ContactMenuOptionIconButton
      contact={contact}
      hideOptions={[EContactOptionId.Detail]}
      onChange={(_, type) => {
        if (type === EObjectChangeType.Delete)
          navigate({ to: "/app/contacts" });
      }}
    />
  );
};

export const Route = createFileRoute("/app/contacts/$id/")({
  search: { middlewares: [stripSearchParams(defaultParams)] },
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  beforeLoad: () => ({
    crumb: null,
    pageHeaderEndContent: <PageOptionsIconButton />,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const { contact } = Route.useRouteContext();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();

  /** Callbacks */

  const handleOnTabChange = (
    _: SyntheticEvent<Element, Event>,
    newValue: number,
  ) => {
    const value = parseInt(String(newValue), 10);
    navigate({ to: ".", search: (s) => ({ ...s, tab: TABS[value] }) });
  };

  return (
    <Stack height="100%">
      <Container>
        <Stack spacing={1} py={2}>
          <ContactDetailCard contact={contact} />
          <Stack spacing={2}>
            <Tabs
              value={TABS.indexOf(tab)}
              variant="scrollable"
              scrollButtons={false}
              onChange={handleOnTabChange}
            >
              <Tab label="Overview" />
              <Tab label="Documents" />
              <Tab label="History" />
            </Tabs>
          </Stack>
        </Stack>
      </Container>
      {tab === "documents" && <DocumentsTab />}
    </Stack>
  );
}

const DocumentsTab: React.FC = () => {
  /** Values */

  const snackbar = useSnackbar();
  const context = Route.useRouteContext();
  const router = useRouter();

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
    <Container sx={{ display: "flex", flexGrow: 1, overflow: "auto" }}>
      <Grid
        container
        spacing={2}
        {...getRootProps()}
        sx={[
          { flexGrow: 1, mb: 2 },
          isDragActive && { bgcolor: "rgba(0,0,0,0.05)", opacity: 0.5 },
        ]}
      >
        {context.contact.documents.map((document) => (
          <Grid key={document.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={document.thumbnail ?? undefined}
                alt={document.original_filename}
              />
              <CardContent>{document.label}</CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
