import { type BaseSelectProps, MenuItem, Select } from "@mui/material";
import { Sort } from "@mui/icons-material";
import { WorkOrderListRequestParamsOrdering } from "@/store/enums/work-orders";

const WorkOrderListOrderingField = (
  props: BaseSelectProps<WorkOrderListRequestParamsOrdering>
) => {
  return (
    <Select
      size="small"
      displayEmpty
      startAdornment={<Sort fontSize="small" />}
      renderValue={(value) =>
        value ? `Ordering: ${value.snakeCaseToTitleCase()}` : "Ordering"
      }
      {...props}
      slotProps={{
        input: {
          sx: { py: 0.5, px: 1, fontSize: 12 },
        },
      }}
    >
      <MenuItem
        value={undefined}
        sx={{ color: "text.disabled", fontStyle: "italic" }}
      >
        None
      </MenuItem>
      {Object.values(WorkOrderListRequestParamsOrdering).map((ordering) => (
        <MenuItem key={ordering} value={ordering}>
          {ordering.snakeCaseToTitleCase()}
        </MenuItem>
      ))}
    </Select>
  );
};

export default WorkOrderListOrderingField;
