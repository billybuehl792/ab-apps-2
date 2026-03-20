import { type ReactNode } from "react";
import {
  Badge,
  IconButton,
  Stack,
  Tooltip,
  type IconButtonProps,
} from "@mui/material";
import { Tune } from "@mui/icons-material";

export interface IFiltersIconButtonProps extends IconButtonProps {
  count?: number;
  tooltip?: ReactNode;
}

const FiltersIconButton: React.FC<IFiltersIconButtonProps> = ({
  count,
  tooltip = "Filters",
  ...props
}) => {
  return (
    <Tooltip title={tooltip}>
      <Stack
        component="span"
        position="relative"
        alignItems="center"
        justifyContent="center"
      >
        <Badge badgeContent={count || null} color="primary">
          <IconButton aria-label="filters" {...props}>
            <Tune />
          </IconButton>
        </Badge>
      </Stack>
    </Tooltip>
  );
};

export default FiltersIconButton;
