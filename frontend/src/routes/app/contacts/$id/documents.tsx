import { type MouseEventHandler, useState } from "react";
import {
  createFileRoute,
  stripSearchParams,
  useLoaderData,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Box, Container } from "@mui/material";
import { Delete, FileUpload } from "@mui/icons-material";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import useContact from "@/store/hooks/useContact";
import FullScreenDialog from "@/components/modals/FullScreenDialog";
import DocumentList from "@/containers/lists/DocumentList";
import MenuOptionMenu from "@/components/modals/MenuOptionMenu";
import { contactQueries } from "@/store/queries/contacts";
import { contactDocumentListRequestSchema } from "@/store/schemas/contacts";
import { EListVariant } from "@/store/enums/layout";
import type { TDocument } from "@/store/types/documents";

const paramsSchema = contactDocumentListRequestSchema.shape.params.extend({
  listVariant: z
    .enum(EListVariant)
    .default(EListVariant.List)
    .catch(EListVariant.List),
});
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/contacts/$id/documents")({
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
  const [contextMenuPos, setContextMenuPos] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const navigate = Route.useNavigate();
  const loaderData = useLoaderData({ from: "/app/contacts/$id" });
  const { listVariant, ...params } = Route.useSearch();

  const { contact } = loaderData;
  const { createDocument, deleteDocument } = useContact(contact, {
    onChange: () => documentListQuery.refetch(),
  });

  /** Queries */

  const documentListQuery = useQuery(
    contactQueries.contact(contact.id).documents.list({ params }),
  );

  const { inputRef, getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) =>
        createDocument({ label: file.name, description: "", file }),
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

  const handleOnContextMenu: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setContextMenuPos({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
  };

  const getCardOptions = (document: TDocument): IMenuOption[] => [
    {
      id: "delete",
      label: "Delete",
      value: "delete",
      color: "error.main",
      Icon: Delete,
      onClick: () => deleteDocument(document.id),
    },
  ];

  /** Options */

  const contextMenuOptions: IMenuOption[] = [
    {
      id: "create",
      label: "Upload File(s)",
      value: "create",
      Icon: FileUpload,
      onClick: () => {
        setContextMenuPos(null);
        inputRef.current?.click();
      },
    },
  ];

  return (
    <>
      <Container
        {...getRootProps()}
        onContextMenu={handleOnContextMenu}
        sx={{ display: "flex", flexGrow: 1 }}
      >
        <input {...getInputProps()} />
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
            card: (document) => ({
              options: getCardOptions(document),
              onClick: () => {
                setSelectedDocument(document);
                setDialogOpen(true);
              },
            }),
          }}
          sx={[
            { flexGrow: 1, width: "100%", pb: 2 },
            isDragActive && {
              opacity: 0.5,
              bgcolor: (theme) => theme.palette.action.hover,
            },
          ]}
        />
      </Container>
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
      <MenuOptionMenu
        open={!!contextMenuPos}
        options={contextMenuOptions}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenuPos
            ? { top: contextMenuPos.mouseY, left: contextMenuPos.mouseX }
            : undefined
        }
        onClose={() => setContextMenuPos(null)}
      />
    </>
  );
}
