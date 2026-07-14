import { useState } from "react";
import {
  createFileRoute,
  stripSearchParams,
  useLoaderData,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Box, Container } from "@mui/material";
import { Delete } from "@mui/icons-material";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import useJob from "@/store/hooks/useJob";
import FullScreenDialog from "@/components/modals/FullScreenDialog";
import DocumentList from "@/containers/lists/DocumentList";
import { jobDocumentListRequestSchema } from "@/store/schemas/jobs";
import { jobQueries } from "@/store/queries/jobs";
import { EListVariant } from "@/store/enums/layout";
import type { TDocument } from "@/store/types/documents";

const paramsSchema = jobDocumentListRequestSchema.shape.params.extend({
  listVariant: z
    .enum(EListVariant)
    .default(EListVariant.List)
    .catch(EListVariant.List),
});
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/jobs/$id/documents")({
  validateSearch: paramsSchema,
  search: {
    middlewares: [
      sanitizeSearchParams(paramsSchema),
      stripSearchParams(defaultParams),
    ],
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TDocument | null>(
    null,
  );

  const navigate = Route.useNavigate();
  const loaderData = useLoaderData({ from: "/app/jobs/$id" });
  const { listVariant, ...params } = Route.useSearch();

  const { job } = loaderData;
  const { createDocument, deleteDocument } = useJob(job);

  /** Queries */

  const documentListQuery = useQuery(
    jobQueries.job(job.id).documents.list({ params }),
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
        deleteDocument(document.id, {
          onSuccess: () => documentListQuery.refetch(),
        }),
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
}
