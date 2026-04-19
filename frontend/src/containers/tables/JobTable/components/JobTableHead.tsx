import React from "react";
import {
  Box,
  TableCell,
  TableHead,
  type TableHeadProps,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { jobTableColumns as columns } from "../constants";
import { EJobListOrdering } from "@/store/enums/jobs";
import { sxUtils } from "@/store/utils/sx";

export interface IJobTableHeadProps extends TableHeadProps {
  ordering?: EJobListOrdering;
  disabled?: boolean;
  onOrderingChange?: (ordering: EJobListOrdering | undefined) => void;
}

const JobTableHead: React.FC<IJobTableHeadProps> = ({
  ordering,
  disabled,
  onOrderingChange,
  ...props
}) => {
  return (
    <TableHead {...props}>
      <TableRow>
        {columns.map(
          ({ id, label, renderCell, orderingOption, slotProps, ...column }) => {
            const sortEnabled = !!orderingOption && !!onOrderingChange;
            const sortDirection = !!orderingOption
              ? ordering === orderingOption.value.asc
                ? "asc"
                : ordering === orderingOption.value.desc
                  ? "desc"
                  : false
              : false;
            const isAsc = sortDirection === "asc";
            const isDesc = sortDirection === "desc";

            const TableLabel =
              typeof label === "string" || typeof label === "number" ? (
                <Typography variant="subtitle2" noWrap>
                  {label}
                </Typography>
              ) : (
                label
              );

            return (
              <TableCell
                key={id}
                sortDirection={sortEnabled ? sortDirection : undefined}
                {...column}
                {...slotProps?.headCell}
                sx={[
                  ...sxUtils.asArray(column.sx),
                  ...sxUtils.asArray(slotProps?.headCell?.sx),
                ]}
              >
                {sortEnabled ? (
                  <TableSortLabel
                    active={!!sortDirection}
                    direction={sortDirection || "asc"}
                    disabled={disabled}
                    {...(!!onOrderingChange && {
                      onClick: () =>
                        onOrderingChange(
                          isAsc
                            ? orderingOption.value.desc
                            : isDesc
                              ? undefined
                              : orderingOption.value.asc,
                        ),
                    })}
                  >
                    {TableLabel}
                    {!!sortDirection && (
                      <Box component="span" sx={visuallyHidden}>
                        {sortDirection === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    )}
                  </TableSortLabel>
                ) : (
                  TableLabel
                )}
              </TableCell>
            );
          },
        )}
      </TableRow>
    </TableHead>
  );
};

export default JobTableHead;
