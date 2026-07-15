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
import { Delete, FileUpload, Info } from "@mui/icons-material";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import useContact from "@/store/hooks/useContact";
import FullScreenDialog from "@/components/modals/FullScreenDialog";
import DocumentList from "@/containers/lists/DocumentList";
import MenuOptionMenu from "@/components/modals/MenuOptionMenu";
import { contactQueries } from "@/store/queries/contacts";
import { idSchema } from "@/store/schemas/basic";
import { contactDocumentListRequestSchema } from "@/store/schemas/contacts";
import { EListVariant } from "@/store/enums/layout";
import type { TDocument } from "@/store/types/documents";

const paramsSchema = contactDocumentListRequestSchema.shape.params.extend({
  selected: idSchema.optional(),
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

  const [contextMenuPos, setContextMenuPos] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const navigate = Route.useNavigate();
  const loaderData = useLoaderData({ from: "/app/contacts/$id" });
  const { listVariant, selected, ...params } = Route.useSearch();

  const { contact } = loaderData;
  const { createDocument, deleteDocument } = useContact(contact, {
    onChange: () => documentListQuery.refetch(),
  });

  /** Queries */

  const documentQuery = useQuery({
    ...contactQueries.contact(contact.id).documents.document(selected!).detail,
    enabled: !!selected,
  });
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

  const listOptions: IMenuOption[] = [
    {
      id: "create",
      label: "Add File",
      value: "create",
      Icon: FileUpload,
      onClick: () => {
        setContextMenuPos(null);
        inputRef.current?.click();
      },
    },
  ];

  const getDocumentOptions = (document: TDocument): IMenuOption[] => [
    {
      id: "view",
      label: "View",
      value: "view",
      Icon: Info,
      onClick: () => handleOnParamsChange({ selected: document.id }),
    },
    {
      id: "delete",
      label: "Delete",
      value: "delete",
      color: "error.main",
      Icon: Delete,
      onClick: () => deleteDocument(document.id),
    },
  ];

  const getSelectedDocumentOptions = (document: TDocument): IMenuOption[] => [
    {
      id: "delete",
      label: "Delete",
      value: "delete",
      color: "error.main",
      Icon: Delete,
      onClick: () =>
        deleteDocument(document.id, {
          onSuccess: () => handleOnParamsChange({ selected: undefined }),
        }),
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
          options={listOptions}
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
              options: getDocumentOptions(document),
              onClick: () => handleOnParamsChange({ selected: document.id }),
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
        open={!!selected}
        label={documentQuery.data?.label ?? ""}
        loading={documentQuery.isLoading}
        error={documentQuery.error}
        empty={!documentQuery.data}
        options={
          documentQuery.isSuccess
            ? getSelectedDocumentOptions(documentQuery.data)
            : []
        }
        onClose={() => handleOnParamsChange({ selected: undefined })}
      >
        <Box
          component="img"
          src={documentQuery.data?.file ?? ""}
          alt={documentQuery.data?.label ?? ""}
          sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </FullScreenDialog>
      <MenuOptionMenu
        open={!!contextMenuPos}
        options={listOptions}
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
