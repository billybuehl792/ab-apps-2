import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { z } from "zod";
import ContactMenuOptionIconButton from "@/containers/buttons/ContactMenuOptionIconButton";
import ContactDetailCard from "@/containers/cards/ContactDetailCard";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import { contactEndpoints } from "@/store/constants/contacts";
import { EContactOptionId } from "@/store/enums/contacts";
import { EObjectChangeType } from "@/store/enums/api";
import type { TDocumentCreate } from "@/store/types/documents";

enum ETabs {
  Overview = "overview",
  Documents = "documents",
  History = "history",
}
const paramsSchema = z.object({
  tab: z.nativeEnum(ETabs).catch(ETabs.Overview),
});
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

  return (
    <Stack height="100%">
      <Container>
        <Stack spacing={1} py={2}>
          <ContactDetailCard contact={contact} />
          <Stack spacing={2}>
            <Tabs
              value={tab}
              variant="scrollable"
              scrollButtons={false}
              onChange={(_, newValue) =>
                navigate({ to: ".", search: (s) => ({ ...s, tab: newValue }) })
              }
            >
              {Object.values(ETabs).map((tab) => (
                <Tab key={tab} label={tab.toTitleCase()} value={tab} />
              ))}
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
  const { contact } = Route.useRouteContext();

  /** Queries */

  const contactDocumentListQuery = useQuery({
    queryKey: ["contactDocuments", contact.id],
    queryFn: () => contactEndpoints.contact(contact.id).documents().get(),
  });

  /** Mutations */

  const contactDocumentUploadMutation = useMutation({
    mutationKey: [
      contactEndpoints.contact(contact.id).documents().id,
      "upload",
    ],
    mutationFn: (body: TDocumentCreate) =>
      contactEndpoints.contact(contact.id).documents().post(body),
    onSuccess: () =>
      snackbar.enqueueSnackbar("Upload successful", { variant: "success" }),
    onError: () =>
      snackbar.enqueueSnackbar("Upload failed", { variant: "error" }),
  });

  const contactDocumentDeleteMutation = useMutation({
    mutationKey: [
      contactEndpoints.contact(contact.id).documents().id,
      "delete",
    ],
    mutationFn: (id: number) =>
      contactEndpoints.contact(contact.id).documents().document(id).delete(),
    onSuccess: () => {
      snackbar.enqueueSnackbar("Delete successful", { variant: "success" });
      contactDocumentListQuery.refetch();
    },
    onError: () =>
      snackbar.enqueueSnackbar("Delete failed", { variant: "error" }),
  });

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) =>
        contactDocumentUploadMutation.mutate(
          { label: file.name, description: "", file },
          { onSuccess: () => contactDocumentListQuery.refetch() },
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
          isDragActive && {
            bgcolor: ({ palette }) => palette.action.hover,
            opacity: 0.5,
          },
        ]}
      >
        {contactDocumentListQuery.data?.results.map((document) => (
          <Grid key={document.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={document.thumbnail ?? undefined}
                alt={document.original_filename}
              />
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>{document.label}</Typography>
                  <MenuOptionIconButton
                    options={[
                      {
                        id: "delete",
                        label: "Delete",
                        value: "delete",
                        onClick: () =>
                          contactDocumentDeleteMutation.mutate(document.id),
                      },
                    ]}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
