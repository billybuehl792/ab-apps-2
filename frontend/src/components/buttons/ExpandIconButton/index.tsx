import {
  type ReactNode,
  type MouseEvent,
  type TouchEvent,
  useState,
  useEffect,
} from "react";
import { IconButton, type IconButtonProps } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const DEFAULT_EXPANDED_ICON = <ExpandLess />;
const DEFAULT_COLLAPSED_ICON = <ExpandMore />;

interface ExpandIconButtonProps extends Omit<IconButtonProps, "onChange"> {
  expanded?: boolean;
  expandedIcon?: ReactNode;
  collapsedIcon?: ReactNode;
  onChange?: (expanded: boolean, event: MouseEvent | TouchEvent) => void;
}

/**
 * This component renders an expandable `IconButton` that toggles between two states.
 */
const ExpandIconButton = ({
  expanded: expandedProp,
  expandedIcon = DEFAULT_EXPANDED_ICON,
  collapsedIcon = DEFAULT_COLLAPSED_ICON,
  onChange: onChangeProp,
  ...props
}: ExpandIconButtonProps) => {
  const [expanded, setExpanded] = useState(!!expandedProp);

  /** Callbacks */

  const onMouseDown: IconButtonProps["onMouseDown"] = (event) => {
    event.stopPropagation();
  };

  const onTouchStart: IconButtonProps["onTouchStart"] = (event) => {
    event.stopPropagation();
  };

  const onClick: IconButtonProps["onClick"] = (event: MouseEvent) => {
    event.stopPropagation();
    const newValue = !expanded;
    setExpanded(newValue);
    onChangeProp?.(newValue, event);
  };

  /** Effects */

  useEffect(() => {
    setExpanded(!!expandedProp);
  }, [expandedProp]);

  return (
    <IconButton
      component="span"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onClick={onClick}
      {...props}
    >
      {expanded ? expandedIcon : collapsedIcon}
    </IconButton>
  );
};

export default ExpandIconButton;
