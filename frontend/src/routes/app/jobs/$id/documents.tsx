import { type MouseEventHandler, useState } from "react";
import {
  createFileRoute,
  stripSearchParams,
  useLoaderData,
} from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Box, Container } from "@mui/material";
import { Delete, FileUpload, Info } from "@mui/icons-material";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import { useSnackbar } from "notistack";
import useConfirm from "@/store/hooks/useConfirm";
import FullScreenDialog from "@/components/modals/FullScreenDialog";
import DocumentList from "@/containers/lists/DocumentList";
import MenuOptionMenu from "@/components/modals/MenuOptionMenu";
import { documentQueries } from "@/store/queries/documents";
import { documentMutations } from "@/store/mutations/documents";
import { idSchema } from "@/store/schemas/basic";
import { jobDocumentListRequestSchema } from "@/store/schemas/jobs";
import { EListVariant } from "@/store/enums/layout";
import type { TDocument } from "@/store/types/documents";

const paramsSchema = jobDocumentListRequestSchema.shape.params.extend({
  selected: idSchema.optional(),
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

  const [selectedDocuments, setSelectedDocuments] = useState<TDocument[]>([]);
  const [contextMenuPos, setContextMenuPos] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();
  const loaderData = useLoaderData({ from: "/app/jobs/$id" });
  const snackbar = useSnackbar();
  const confirm = useConfirm();

  const { job } = loaderData;
  const { listVariant, selected, ...params } = searchParams;

  const { inputRef, getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => handleCreateDocuments(acceptedFiles),
  });

  /** Queries */

  const documentListQuery = useQuery(
    documentQueries.list({ params: { ...params, job: job.id } }),
  );
  const selectedDocumentQuery = useQuery({
    ...documentQueries.document(selected!).detail,
    enabled: !!selected,
  });

  /** Mutations */

  const createDocumentMutation = useMutation(documentMutations.create);
  const deleteDocumentMutation = useMutation(documentMutations.delete);

  const isMutating =
    createDocumentMutation.isPending || deleteDocumentMutation.isPending;

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

  const handleCreateDocuments = async (files: File[]) => {
    setSelectedDocuments([]);
    const results = await Promise.allSettled(
      files.map((file) =>
        createDocumentMutation.mutateAsync({
          label: file.name,
          description: "",
          file,
          job: job.id,
        }),
      ),
    );

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    if (fulfilled.length > 0)
      snackbar.enqueueSnackbar(
        `${fulfilled.length} files uploaded successfully`,
        { variant: "success" },
      );
    if (rejected.length > 0)
      snackbar.enqueueSnackbar(`${rejected.length} files failed to upload`, {
        variant: "error",
      });

    documentListQuery.refetch();
  };

  const handleDeleteDocuments = (documents: TDocument[]) =>
    confirm(
      {
        title: `Delete ${documents.length} document(s)?`,
        description: `Are you sure you want to delete these documents? This operation is irreversible.`,
      },
      async () => {
        const results = await Promise.allSettled(
          documents.map(({ id }) => deleteDocumentMutation.mutateAsync(id)),
        );

        const fulfilled = results.filter((r) => r.status === "fulfilled");
        const rejected = results.filter((r) => r.status === "rejected");

        if (fulfilled.length > 0)
          snackbar.enqueueSnackbar(
            `${fulfilled.length} files deleted successfully`,
            { variant: "success" },
          );

        if (rejected.length > 0)
          snackbar.enqueueSnackbar(
            `${rejected.length} files failed to delete`,
            { variant: "error" },
          );

        documentListQuery.refetch();
        setSelectedDocuments([]);
      },
    );

  /** Options */

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

  const getCardOptions = (document: TDocument): IMenuOption[] => [
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
      onClick: () => deleteDocumentMutation.mutate(document.id),
    },
  ];

  const getSelectedOptions = (documents: TDocument[]): IMenuOption[] => [
    {
      id: "delete",
      label: "Delete",
      value: "delete",
      color: "error.main",
      Icon: Delete,
      onClick: () => handleDeleteDocuments(documents),
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
        deleteDocumentMutation.mutate(document.id, {
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
          disabled={isMutating}
          error={documentListQuery.error}
          listVariant={listVariant}
          selected={selectedDocuments}
          options={listOptions}
          cardOptions={getCardOptions}
          selectedOptions={getSelectedOptions}
          onPageChange={(page) => handleOnParamsChange({ page })}
          onPageSizeChange={(page_size) =>
            handleOnParamsChange({ page: 1, page_size })
          }
          onSearchChange={(search) => handleOnParamsChange({ page: 1, search })}
          onListVariantChange={(listVariant) =>
            handleOnParamsChange({ listVariant })
          }
          onSelectedChange={setSelectedDocuments}
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
        label={selectedDocumentQuery.data?.label ?? ""}
        loading={selectedDocumentQuery.isLoading}
        error={selectedDocumentQuery.error}
        empty={!selectedDocumentQuery.data}
        options={
          selectedDocumentQuery.isSuccess
            ? getSelectedDocumentOptions(selectedDocumentQuery.data)
            : []
        }
        onClose={() => handleOnParamsChange({ selected: undefined })}
      >
        <Box
          component="img"
          src={selectedDocumentQuery.data?.file ?? ""}
          alt={selectedDocumentQuery.data?.label ?? ""}
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
