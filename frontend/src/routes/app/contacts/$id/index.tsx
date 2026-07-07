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
import useConfirm from "@/store/hooks/useConfirm";
import useContact from "@/store/hooks/useContact";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import ContactMenuOptionIconButton from "@/containers/buttons/ContactMenuOptionIconButton";
import ContactDetailCard from "@/containers/cards/ContactDetailCard";
import DocumentList from "@/containers/lists/DocumentList";
import HistoryList from "@/containers/lists/HistoryList";
import FullScreenDialog from "@/components/modals/FullScreenDialog";
import { documentListRequestSchema } from "@/store/schemas/documents";
import { contactQueries } from "@/store/queries/contacts";
import { EContactOptionId } from "@/store/enums/contacts";
import { EObjectChangeType } from "@/store/enums/api";
import { EListVariant } from "@/store/enums/layout";
import type { TDocument } from "@/store/types/documents";
import { jobQueries } from "@/store/queries/jobs";
import JobList from "@/containers/lists/JobList";

enum ETabs {
  Overview = "overview",
  Jobs = "jobs",
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
      {tab === ETabs.Jobs && <JobsTab />}
      {tab === ETabs.Documents && <DocumentsTab />}
      {tab === ETabs.History && <HistoryTab />}
    </Stack>
  );
}

const JobsTab: React.FC = () => {
  /** Values */

  const navigate = Route.useNavigate();
  const { contact } = Route.useRouteContext();
  const { tab, listVariant, ...params } = Route.useSearch();

  /** Queries */

  const jobListQuery = useQuery(
    jobQueries.list({ params: { recipients: [contact.id], ...params } }),
  );

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
      <JobList
        items={jobListQuery.data?.results ?? []}
        count={jobListQuery.data?.count ?? -1}
        page={params.page}
        pageSize={params.page_size}
        search={params.search}
        loading={jobListQuery.isLoading}
        error={jobListQuery.error}
        onPageChange={(page) => handleOnParamsChange({ page })}
        onPageSizeChange={(page_size) =>
          handleOnParamsChange({ page: 1, page_size })
        }
        onSearchChange={(search) => handleOnParamsChange({ page: 1, search })}
        slotProps={{
          root: { flexGrow: 1, width: "100%", pb: 2 },
          card: (job) => ({
            link: { to: "/app/jobs/$id", params: { id: String(job.id) } },
          }),
        }}
      />
    </Container>
  );
};

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
  const confirm = useConfirm();

  /** Queries */

  const documentListQuery = useQuery(
    contactQueries.contact(contact.id).documents.list({ params }),
  );

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) =>
        createDocument(
          { label: file.name, description: "", file },
          { onSuccess: () => documentListQuery.refetch() },
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
        confirm(
          {
            title: `Delete ${document.label}?`,
            description: `Are you sure you want to delete this document? This operation is irreversible.`,
          },
          () =>
            deleteDocument(document.id, {
              onSuccess: () => documentListQuery.refetch(),
            }),
        ),
    },
  ];

  return (
    <Container sx={{ display: "flex", flexGrow: 1 }}>
      <DocumentList
        items={documentListQuery.data?.results ?? []}
        count={documentListQuery.data?.count ?? -1}
        page={params.page}
        pageSize={params.page_size}
        search={params.search}
        loading={documentListQuery.isLoading}
        error={documentListQuery.error}
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
  /** Values */

  const navigate = Route.useNavigate();
  const { contact } = Route.useRouteContext();
  const { tab, listVariant, ...params } = Route.useSearch();

  /** Queries */

  const contactHistoryListQuery = useQuery(
    contactQueries.contact(contact.id).history.list({ params }),
  );

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
