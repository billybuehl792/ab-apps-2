import { Stack, Typography } from "@mui/material";
import {
  getGridDateOperators,
  getGridStringOperators,
  type GridColDef,
  type GridSortModel,
} from "@mui/x-data-grid";
import ContactChip from "@/containers/chips/ContactChip";
import PlaceChip from "@/containers/chips/PlaceChip";
import EmptyChip from "@/components/chips/EmptyChip";
import JobMenuOptionIconButton from "@/containers/buttons/JobMenuOptionIconButton";
import { jobListOrderingOptions } from "@/store/constants/jobs";
import { EJobListOrdering } from "@/store/enums/jobs";
import type { TJob } from "@/store/types/jobs";

const nullableDateOperators = getGridDateOperators(true).filter(({ value }) =>
  ["isEmpty", "isNotEmpty"].includes(value),
);

export const FIELD_ORDERING_MAP: Partial<
  Record<string, TOrderingOption<EJobListOrdering>>
> = {
  label: jobListOrderingOptions.label,
  recipient: jobListOrderingOptions.recipient,
  place: jobListOrderingOptions.place,
  representative: jobListOrderingOptions.representative,
  assignee: jobListOrderingOptions.assignee,
  referred_by: jobListOrderingOptions.referredBy,
  amount: jobListOrderingOptions.amount,
  created_at: jobListOrderingOptions.createdAt,
  updated_at: jobListOrderingOptions.updatedAt,
};

const labelColumn: GridColDef<TJob> = {
  field: "label",
  type: "string",
  headerName: "Title",
  flex: 2,
  minWidth: 180,
  filterOperators: getGridStringOperators().filter(({ value }) =>
    ["contains"].includes(value),
  ),
  renderCell: ({ row }) => (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      height="100%"
      spacing={1}
    >
      <Typography
        variant="body2"
        noWrap
        {...(!row.label && { color: "text.secondary", fontStyle: "italic" })}
      >
        {row.label || "Untitled"}
      </Typography>
      <JobMenuOptionIconButton job={row} size="small" />
    </Stack>
  ),
};

export const jobGridColumns: GridColDef<TJob>[] = [
  labelColumn,
  {
    field: "recipient",
    headerName: "Recipient",
    flex: 1,
    minWidth: 140,
    renderCell: ({ row }) =>
      row.recipient ? (
        <ContactChip contact={row.recipient} size="xxs" />
      ) : (
        <EmptyChip size="xxs" />
      ),
  },
  {
    field: "place",
    headerName: "Address",
    flex: 1.5,
    minWidth: 160,
    renderCell: ({ row }) =>
      row.place ? (
        <PlaceChip place={row.place} size="xxs" />
      ) : (
        <EmptyChip size="xxs" />
      ),
  },
  {
    field: "representative",
    headerName: "Sales Rep.",
    flex: 1,
    minWidth: 140,
    renderCell: ({ row }) =>
      row.representative ? (
        <ContactChip contact={row.representative} size="xxs" />
      ) : (
        <EmptyChip size="xxs" />
      ),
  },
  {
    field: "assignee",
    headerName: "Assignee",
    flex: 1,
    minWidth: 140,
    renderCell: ({ row }) =>
      row.assignee ? (
        <ContactChip contact={row.assignee} size="xxs" />
      ) : (
        <EmptyChip size="xxs" />
      ),
  },
  {
    field: "referred_by",
    headerName: "Referred By",
    flex: 1,
    minWidth: 140,
    renderCell: ({ row }) =>
      row.referred_by ? (
        <ContactChip contact={row.referred_by} size="xxs" />
      ) : (
        <EmptyChip size="xxs" />
      ),
  },
  {
    field: "amount",
    headerName: "Amount ($)",
    flex: 0.8,
    minWidth: 100,
    align: "right",
    headerAlign: "right",
    renderCell: ({ row }) => (row.amount != null ? row.amount.toFixed(2) : "-"),
  },
  {
    field: "categories",
    headerName: "Categories",
    flex: 1,
    minWidth: 120,
    sortable: false,
    renderCell: ({ row }) =>
      row.categories.length ? row.categories.join(", ") : "-",
  },
  {
    field: "scheduled_at",
    headerName: "Scheduled",
    type: "dateTime",
    sortable: false,
    filterable: true,
    filterOperators: nullableDateOperators,
    valueGetter: (value: TJob["scheduled_at"]) =>
      value ? new Date(value) : null,
  },
  {
    field: "completed_at",
    headerName: "Completed",
    type: "dateTime",
    sortable: false,
    filterable: true,
    filterOperators: nullableDateOperators,
    valueGetter: (value: TJob["completed_at"]) =>
      value ? new Date(value) : null,
  },
];

export const sortModelToOrdering = (
  sortModel: GridSortModel,
): EJobListOrdering | undefined => {
  const [sort] = sortModel;
  if (!sort) return undefined;
  const option = FIELD_ORDERING_MAP[sort.field];
  if (!option) return undefined;
  return sort.sort === "asc" ? option.value.asc : option.value.desc;
};

export const orderingToSortModel = (
  ordering: EJobListOrdering | undefined,
): GridSortModel => {
  if (!ordering) return [];
  for (const [field, option] of Object.entries(FIELD_ORDERING_MAP)) {
    if (!option) continue;
    if (option.value.asc === ordering) return [{ field, sort: "asc" }];
    if (option.value.desc === ordering) return [{ field, sort: "desc" }];
  }
  return [];
};
