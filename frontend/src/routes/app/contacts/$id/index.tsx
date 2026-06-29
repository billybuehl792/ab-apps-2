import { useState } from "react";
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Box, Container, Stack, Tab, Tabs } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import useContact from "@/store/hooks/useContact";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import ContactMenuOptionIconButton from "@/containers/buttons/ContactMenuOptionIconButton";
import ContactDetailCard from "@/containers/cards/ContactDetailCard";
import DocumentList from "@/containers/lists/DocumentList";
import HistoryList from "@/containers/lists/HistoryList";
import FullScreenDialog from "@/components/modals/FullScreenDialog";
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
  tab: z.enum(ETabs).default(ETabs.Overview).catch(ETabs.Overview),
  listVariant: z
    .enum(EListVariant)
    .default(EListVariant.List)
    .catch(EListVariant.List),
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
          navigate({ to: "/app/contacts", replace: true });
      }}
    />
  );
};

export const Route = createFileRoute("/app/contacts/$id/")({
  validateSearch: paramsSchema,
  search: {
    middlewares: [
      sanitizeSearchParams(paramsSchema),
      stripSearchParams(defaultParams),
    ],
  },
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
  const navigate = Route.useNavigate();

  return (
    <Stack width="100%" height="100%" overflow="auto">
      <Container sx={{ mt: 2 }}>
        <ContactDetailCard contact={contact} sx={{ mb: 1 }} />
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
      </Container>
      {tab === ETabs.Documents && <DocumentsTab />}
      {tab === ETabs.History && <HistoryTab />}
    </Stack>
  );
}

const DocumentsTab: React.FC = () => {
  /** Values */

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TDocument | null>(
    null,
  );

  const navigate = Route.useNavigate();
  const { contact } = Route.useRouteContext();
  const { tab, listVariant, ...params } = Route.useSearch();
  const { createDocument, deleteDocument } = useContact(contact);

  /** Queries */

  const contactDocumentListQuery = useQuery({
    queryKey: ["contacts", "contact", contact.id, "documents", { params }],
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
    <Container sx={{ display: "flex", flexGrow: 1 }}>
      <DocumentList
        items={contactDocumentListQuery.data?.results ?? []}
        count={contactDocumentListQuery.data?.count ?? -1}
        page={params.page}
        pageSize={params.page_size}
        search={params.search}
        loading={contactDocumentListQuery.isLoading}
        error={contactDocumentListQuery.error}
        listVariant={listVariant}
        onPageChange={(page) => handleOnParamsChange({ page })}
        onPageSizeChange={(page_size) =>
          handleOnParamsChange({ page: 1, page_size })
        }
        onSearchChange={(search) => handleOnParamsChange({ page: 1, search })}
        onListVariantChange={(listVariant) =>
          handleOnParamsChange({ listVariant })
        }
        slotProps={{
          list: {
            ...getRootProps(),
            sx: [
              { flexGrow: 1 },
              isDragActive && {
                opacity: 0.5,
                bgcolor: (theme) => theme.palette.action.hover,
              },
            ],
          },
          card: (document) => ({
            options: getCardOptions(document),
            onClick: () => {
              setSelectedDocument(document);
              setDialogOpen(true);
            },
          }),
        }}
        sx={{ flexGrow: 1, width: "100%", pb: 2 }}
      />
      <FullScreenDialog
        open={dialogOpen}
        label={selectedDocument?.label ?? ""}
        onClose={() => setDialogOpen(false)}
        onTransitionExited={() => setSelectedDocument(null)}
        slotProps={{
          backdrop: { sx: { opacity: 0.5 } },
        }}
      >
        <Box
          component="img"
          src={selectedDocument?.file ?? ""}
          alt={selectedDocument?.label ?? ""}
          sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </FullScreenDialog>
    </Container>
  );
};

const HistoryTab: React.FC = () => {
  const navigate = Route.useNavigate();
  const { contact } = Route.useRouteContext();
  const { tab, listVariant, ...params } = Route.useSearch();

  /** Queries */

  const contactHistoryListQuery = useQuery({
    queryKey: ["contacts", "contact", contact.id, "history", { params }],
    queryFn: () =>
      contactEndpoints.contact(contact.id).history().get({ params }),
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

  return (
    <Container sx={{ display: "flex", flexGrow: 1 }}>
      <HistoryList
        items={contactHistoryListQuery.data?.results ?? []}
        count={contactHistoryListQuery.data?.count ?? -1}
        page={params.page}
        pageSize={params.page_size}
        search={params.search}
        loading={contactHistoryListQuery.isLoading}
        error={contactHistoryListQuery.error}
        onPageChange={(page) => handleOnParamsChange({ page })}
        onPageSizeChange={(page_size) =>
          handleOnParamsChange({ page: 1, page_size })
        }
        onSearchChange={(search) => handleOnParamsChange({ page: 1, search })}
        sx={{ flexGrow: 1, width: "100%", pb: 2 }}
      />
    </Container>
  );
};
