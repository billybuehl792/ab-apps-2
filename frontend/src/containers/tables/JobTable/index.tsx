import {
  Paper,
  Table,
  TableContainer,
  TablePagination,
  type TablePaginationProps,
  type PaperProps,
} from "@mui/material";
import JobTableHead from "./components/JobTableHead";
import JobTableBody from "./components/JobTableBody";
import { sxUtils } from "@/store/utils/sx";
import { EJobListOrdering } from "@/store/enums/jobs";
import type { TJob } from "@/store/types/jobs";

export interface IJobTableProps
  extends
    PaperProps,
    Pick<
      TablePaginationProps,
      | "page"
      | "count"
      | "rowsPerPage"
      | "rowsPerPageOptions"
      | "onPageChange"
      | "onRowsPerPageChange"
    > {
  rows: TJob[];
  ordering?: EJobListOrdering;
  loading?: boolean;
  disabled?: boolean;
  onOrderingChange?: (ordering: EJobListOrdering | undefined) => void;
  onRowClick?: (job: TJob) => void;
}

const JobTable: React.FC<IJobTableProps> = ({
  rows,
  page: pageProp,
  rowsPerPage,
  rowsPerPageOptions,
  ordering,
  count,
  loading,
  disabled,
  onPageChange,
  onOrderingChange,
  onRowsPerPageChange,
  onRowClick,
  ...props
}) => {
  /** Values */

  const page = Math.max(0, pageProp - 1);

  /** Callbacks */

  const handleOnPageChange: TablePaginationProps["onPageChange"] = (
    event,
    newPage,
  ) => onPageChange(event, Math.max(0, newPage + 1));

  return (
    <Paper
      variant="outlined"
      {...props}
      sx={[
        { position: "relative", width: "100%", overflow: "hidden" },
        ...sxUtils.asArray(props?.sx),
      ]}
    >
      <TableContainer sx={{ minHeight: 400, maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <JobTableHead
            ordering={ordering}
            disabled={disabled || loading}
            onOrderingChange={onOrderingChange}
          />
          <JobTableBody
            rows={rows}
            rowsPerPage={rowsPerPage}
            loading={loading}
            disabled={disabled}
            onRowClick={onRowClick}
          />
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        page={page}
        onPageChange={handleOnPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
      />
    </Paper>
  );
};

export default JobTable;
