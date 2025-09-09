import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  type MenuItemProps,
} from "@mui/material";
import { Work } from "@mui/icons-material";
import type { WorkOrder } from "@/store/types/work-orders";

interface WorkOrderMenuItemProps extends MenuItemProps {
  workOrder: WorkOrder;
}

const WorkOrderMenuItem = ({ workOrder, ...props }: WorkOrderMenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <Work />
      </ListItemIcon>
      <ListItemText
        primary={workOrder.label}
        secondary={workOrder.description}
      />
    </MenuItem>
  );
};

export default WorkOrderMenuItem;
