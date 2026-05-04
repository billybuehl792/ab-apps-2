import { useState } from "react";
import {
  DataGrid,
  type DataGridProps,
  type GridFilterModel,
  type GridPaginationModel,
  type GridRowParams,
  type GridSortModel,
} from "@mui/x-data-grid";
import JobGridToolbar from "./components/JobGridToolbar";
import {
  jobGridColumns,
  orderingToSortModel,
  sortModelToOrdering,
} from "./constants";
import type { TJob, TJobListRequest } from "@/store/types/jobs";

export interface IJobGridProps extends Omit<
  DataGridProps<TJob>,
  | "rows"
  | "columns"
  | "onRowClick"
  | "filterModel"
  | "onFilterModelChange"
  | "paginationModel"
  | "onPaginationModelChange"
  | "sortModel"
  | "onSortModelChange"
> {
  rows: TJob[];
  params: TJobListRequest["params"];
  onParamsChange: (newParams: TJobListRequest["params"]) => void;
  onRowClick?: (job: TJob) => void;
}

const JobGrid: React.FC<IJobGridProps> = ({
  rows,
  params,
  onParamsChange,
  onRowClick,
  ...props
}) => {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  /** Values */

  const sortModel: GridSortModel = orderingToSortModel(params.ordering);
  const paginationModel: GridPaginationModel = {
    page: params.page - 1,
    pageSize: params.page_size,
  };

  /** Callbacks */

  const handlePaginationModelChange = (model: GridPaginationModel) =>
    onParamsChange({
      ...params,
      page: model.page + 1,
      page_size: model.pageSize,
    });

  const handleSortModelChange = (model: GridSortModel) =>
    onParamsChange({
      ...params,
      page: 1,
      ordering: sortModelToOrdering(model),
    });

  const handleRowClick = (gridParams: GridRowParams<TJob>) =>
    onRowClick?.(gridParams.row);

  return (
    <DataGrid
      rows={rows}
      columns={jobGridColumns}
      paginationMode="server"
      sortingMode="server"
      filterMode="server"
      pageSizeOptions={[10, 20, 50, 100]}
      paginationModel={paginationModel}
      sortModel={sortModel}
      showToolbar
      filterModel={filterModel}
      disableColumnFilter
      slots={{ toolbar: JobGridToolbar }}
      onRowClick={handleRowClick}
      onPaginationModelChange={handlePaginationModelChange}
      onSortModelChange={handleSortModelChange}
      onFilterModelChange={(model) => setFilterModel(model)}
      {...props}
    />
  );
};

export default JobGrid;
