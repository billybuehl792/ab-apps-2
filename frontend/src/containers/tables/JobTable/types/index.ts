import { type ReactNode } from "react";
import { type TableCellProps } from "@mui/material";
import { jobListOrderingOptions } from "@/store/constants/jobs";
import type { TJob } from "@/store/types/jobs";

type TJobListOrderingOption =
  (typeof jobListOrderingOptions)[keyof typeof jobListOrderingOptions];

export type TJobTableColumn = Pick<TableCellProps, "align" | "width" | "sx"> & {
  id: string;
  label: ReactNode;
  orderingOption?: TJobListOrderingOption;
  renderCell: (value: TJob) => ReactNode;
  slotProps?: {
    headCell?: TableCellProps;
    bodyCell?: TableCellProps;
  };
};
