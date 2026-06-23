import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Container, Stack, Tab, Tabs } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import useContact from "@/store/hooks/useContact";
import ContactMenuOptionIconButton from "@/containers/buttons/ContactMenuOptionIconButton";
import ContactDetailCard from "@/containers/cards/ContactDetailCard";
import DocumentList from "@/containers/lists/DocumentList";
import { documentListRequestSchema } from "@/store/schemas/documents";
import contactEndpoints from "@/store/endpoints/contacts";
import { EContactOptionId } from "@/store/enums/contacts";
import { EObjectChangeType } from "@/store/enums/api";
import { EListVariant } from "@/store/enums/layout";
import type { TDocument } from "@/store/types/documents";

enum ETabs {
  Overview = "overview",
  Documents = "documents",
  History = "history",
}

const paramsSchema = documentListRequestSchema.shape.params.extend({
  tab: z.nativeEnum(ETabs).catch(ETabs.Overview),
  variant: z.nativeEnum(EListVariant).catch(EListVariant.List),
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
              onChange={(_, tab) =>
                navigate({ to: ".", replace: true, search: { tab } })
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

  const navigate = useNavigate();
  const { contact } = Route.useRouteContext();
  const { tab, variant, ...params } = Route.useSearch();
  const { createDocument, deleteDocument } = useContact(contact);

  /** Queries */

  const contactDocumentListQuery = useQuery({
    queryKey: ["contactDocuments", contact.id, { params }],
    queryFn: () =>
      contactEndpoints.contact(contact.id).documents().get({ params }),
  });

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) =>
        createDocument(
          { label: file.name, description: "", file },
          { onSuccess: () => contactDocumentListQuery.refetch() },
        ),
      );
    },
  });

  /** Callbacks */

  const handleOnParamsChange = (
    newParams: Partial<z.infer<typeof paramsSchema>>,
  ) =>
    navigate({
      to: ".",
      replace: true,
      search: (s) => ({ ...s, ...newParams }),
    });

  /** Options */

  const getCardOptions = (document: TDocument): IMenuOption[] => [
    {
      id: "delete",
      label: "Delete",
      value: "delete",
      color: "error.main",
      Icon: Delete,
      onClick: () =>
        deleteDocument(document.id, {
          onSuccess: () => contactDocumentListQuery.refetch(),
        }),
    },
  ];

  return (
    <Container sx={{ display: "flex", flexGrow: 1, overflow: "auto" }}>
      <DocumentList
        items={contactDocumentListQuery.data?.results ?? []}
        count={contactDocumentListQuery.data?.count ?? -1}
        page={params.page}
        pageSize={params.page_size}
        search={params.search}
        loading={contactDocumentListQuery.isLoading}
        error={contactDocumentListQuery.error}
        variant={variant}
        onSearchChange={(search) => handleOnParamsChange({ search })}
        onPageChange={(page) => handleOnParamsChange({ page })}
        onPageSizeChange={(page_size) => handleOnParamsChange({ page_size })}
        onVariantChange={(variant) => handleOnParamsChange({ variant })}
        slotProps={{
          header: {
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
          },
          list: {
            ...getRootProps(),
            sx: [
              { flexGrow: 1, pb: 2 },
              isDragActive && {
                opacity: 0.5,
                bgcolor: (theme) => theme.palette.action.hover,
              },
            ],
          },
          card: (document) => ({
            options: getCardOptions(document),
            onClick: () => {
              console.log("Document clicked:", document);
            },
          }),
        }}
        sx={{ flexGrow: 1, width: "100%" }}
      />
    </Container>
  );
};
