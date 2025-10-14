import { type ComponentProps, useState } from "react";
import {
  Badge,
  Box,
  IconButton,
  IconButtonProps,
  Tooltip,
} from "@mui/material";
import { Tune } from "@mui/icons-material";
import PaginatedQueryListParamsFormDrawer from "../modals/PaginatedQueryListParamsFormDrawer";
import type { PaginatedQueryListBaseProps } from "../..";
import type { ListRequestParams } from "@/store/types/api";
import { useQuery } from "@tanstack/react-query";

type PaginatedQueryListParamsFormIconButtonProps<
  Params extends ListRequestParams,
  Data = unknown,
> = Omit<IconButtonProps, "onClick"> &
  PaginatedQueryListBaseProps<Params, Data> &
  Pick<
    ComponentProps<typeof PaginatedQueryListParamsFormDrawer<Params, Data>>,
    "FormComponent"
  >;

const PaginatedQueryListParamsFormIconButton = <
  Params extends ListRequestParams,
  Data = unknown,
>({
  queryOptions,
  baseParams,
  onParamsChange,
  FormComponent,
  ...props
}: PaginatedQueryListParamsFormIconButtonProps<Params, Data>) => {
  const [open, setOpen] = useState(false);

  /** Values */

  const params = queryOptions.queryKey[1] as Params;

  const hasParams = Object.entries(params).some(([key, value]) => {
    if (baseParams && key in baseParams) return false;
    else if (["search", "page_size", "page"].includes(key)) return false;
    else if (Array.isArray(value)) return value.length > 0;
    else return Boolean(value);
  });

  /** Queries */

  const query = useQuery(queryOptions);

  /** Callbacks */

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="List Options">
        <Box component="span">
          <IconButton
            disabled={query.isLoading}
            onClick={handleOpen}
            {...props}
          >
            <Badge color="primary" variant="dot" invisible={!hasParams}>
              <Tune />
            </Badge>
          </IconButton>
        </Box>
      </Tooltip>
      <PaginatedQueryListParamsFormDrawer
        open={open}
        queryOptions={queryOptions}
        baseParams={baseParams}
        FormComponent={FormComponent}
        onParamsChange={onParamsChange}
        onClose={handleClose}
      />
    </>
  );
};

export default PaginatedQueryListParamsFormIconButton;
