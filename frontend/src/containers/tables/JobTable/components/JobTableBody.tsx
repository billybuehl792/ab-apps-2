import React from "react";
import {
  Skeleton,
  TableBody,
  TableCell,
  TableRow,
  type TableBodyProps,
} from "@mui/material";
import { jobTableColumns as columns } from "../constants";
import type { TJob } from "@/store/types/jobs";

export interface IJobTableBodyProps extends TableBodyProps {
  rows: TJob[];
  rowsPerPage: number;
  disabled?: boolean;
  loading?: boolean;
}

const JobTableBody: React.FC<IJobTableBodyProps> = ({
  rows,
  loading,
  disabled,
  rowsPerPage,
  ...props
}) => {
  return (
    <TableBody {...props}>
      {loading
        ? Array.from({ length: rowsPerPage }).map((_, index) => (
            <TableRow key={index}>
              {columns.map(
                ({ id, label, renderCell, orderingOption, ...column }) => (
                  <TableCell
                    key={id}
                    {...column}
                    {...column?.slotProps?.bodyCell}
                  >
                    <Skeleton />
                  </TableCell>
                ),
              )}
            </TableRow>
          ))
        : rows.map((row) => (
            <TableRow key={row.id} hover tabIndex={-1}>
              {columns.map(
                ({ id, label, renderCell, orderingOption, ...column }) => (
                  <TableCell
                    key={id}
                    {...column}
                    {...column?.slotProps?.bodyCell}
                  >
                    {renderCell(row)}
                  </TableCell>
                ),
              )}
            </TableRow>
          ))}
    </TableBody>
  );
};

export default JobTableBody;
