import { Stack, Typography } from "@mui/material";
import JobMenuOptionIconButton from "@/containers/buttons/JobMenuOptionIconButton";
import ContactChip from "@/containers/chips/ContactChip";
import PlaceChip from "@/containers/chips/PlaceChip";
import EmptyChip from "@/components/chips/EmptyChip";
import { jobListOrderingOptions } from "@/store/constants/jobs";
import type { TJobTableColumn } from "../types";

export const jobTableColumns: readonly TJobTableColumn[] = [
  {
    id: "label",
    label: "Title",
    orderingOption: jobListOrderingOptions.label,
    renderCell: (value) => (
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="body2" noWrap>
          {value.label}
        </Typography>
        <JobMenuOptionIconButton job={value} size="small" />
      </Stack>
    ),
    slotProps: {
      headCell: { sx: { zIndex: 3 } },
    },
    sx: {
      position: "sticky",
      left: 0,
      zIndex: 1,
      borderRight: (theme) => `1px solid ${theme.palette.divider}`,
      backgroundColor: "background.paper",
    },
  },
  {
    id: "place",
    label: "Address",
    orderingOption: jobListOrderingOptions.place,
    renderCell: (value) =>
      value.place ? (
        <PlaceChip place={value.place} size="xxs" />
      ) : (
        <EmptyChip size="xxs" />
      ),
  },
  {
    id: "recipient",
    label: "Recipient",
    orderingOption: jobListOrderingOptions.recipient,
    renderCell: (value) =>
      value.recipient ? (
        <ContactChip contact={value.recipient} size="xxs" />
      ) : (
        <EmptyChip size="xxs" />
      ),
  },
  {
    id: "representative",
    label: "Sales Rep.",
    orderingOption: jobListOrderingOptions.representative,
    renderCell: (value) =>
      value.representative ? (
        <ContactChip contact={value.representative} size="xxs" />
      ) : (
        <EmptyChip size="xxs" />
      ),
  },
  {
    id: "referredBy",
    label: "Referred By",
    orderingOption: jobListOrderingOptions.referredBy,
    renderCell: (value) =>
      value.referred_by ? (
        <ContactChip contact={value.referred_by} size="xxs" />
      ) : (
        <EmptyChip size="xxs" />
      ),
  },
  {
    id: "amount",
    label: "Amount ($)",
    orderingOption: jobListOrderingOptions.amount,
    renderCell: (value) => value.amount?.toFixed(2) ?? "-",
  },
  {
    id: "categories",
    label: "Categories",
    renderCell: (value) => value.categories.join(", "),
  },
];
