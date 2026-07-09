import type { ElementType } from "react";
import type { ChipProps } from "@mui/material/Chip";
import {
  Cases,
  Check,
  CreateNewFolder,
  DoNotDisturb,
  Edit,
  Grading,
  MedicalServices,
  Work,
} from "@mui/icons-material";
import { EJobListOrdering, EJobStatus } from "../enums/jobs";

/** Icons */

export const JobIcons: Record<string, ElementType> = {
  List: Cases,
  Detail: Work,
  Create: MedicalServices,
  Edit: Edit,
};

export const JobStatusIcons: Record<EJobStatus, ElementType> = {
  [EJobStatus.Lead]: CreateNewFolder,
  [EJobStatus.InProgress]: Grading,
  [EJobStatus.Completed]: Check,
  [EJobStatus.Cancelled]: DoNotDisturb,
};

export const JobStatusColors: Record<EJobStatus, ChipProps["color"]> = {
  [EJobStatus.Lead]: "default",
  [EJobStatus.InProgress]: "primary",
  [EJobStatus.Completed]: "success",
  [EJobStatus.Cancelled]: "error",
};

/** Other */

export const jobListOrderingOptions: Record<
  string,
  TOrderingOption<EJobListOrdering>
> = {
  label: {
    id: "label",
    label: "Label",
    value: {
      asc: EJobListOrdering.LabelAsc,
      desc: EJobListOrdering.LabelDesc,
    },
  },
  representative: {
    id: "representative",
    label: "Representative",
    value: {
      asc: EJobListOrdering.RepresentativeAsc,
      desc: EJobListOrdering.RepresentativeDesc,
    },
  },
  recipient: {
    id: "recipient",
    label: "Recipient",
    value: {
      asc: EJobListOrdering.RecipientAsc,
      desc: EJobListOrdering.RecipientDesc,
    },
  },
  assignee: {
    id: "assignee",
    label: "Assignee",
    value: {
      asc: EJobListOrdering.AssigneeAsc,
      desc: EJobListOrdering.AssigneeDesc,
    },
  },
  referredBy: {
    id: "referredBy",
    label: "Referred By",
    value: {
      asc: EJobListOrdering.ReferredByAsc,
      desc: EJobListOrdering.ReferredByDesc,
    },
  },
  place: {
    id: "place",
    label: "Place",
    value: {
      asc: EJobListOrdering.PlaceAsc,
      desc: EJobListOrdering.PlaceDesc,
    },
  },
  amount: {
    id: "amount",
    label: "Amount",
    value: {
      asc: EJobListOrdering.AmountAsc,
      desc: EJobListOrdering.AmountDesc,
    },
  },
  createdAt: {
    id: "createdAt",
    label: "Created",
    value: {
      asc: EJobListOrdering.CreatedAtAsc,
      desc: EJobListOrdering.CreatedAtDesc,
    },
  },
  updatedAt: {
    id: "updatedAt",
    label: "Updated",
    value: {
      asc: EJobListOrdering.UpdatedAtAsc,
      desc: EJobListOrdering.UpdatedAtDesc,
    },
  },
};
