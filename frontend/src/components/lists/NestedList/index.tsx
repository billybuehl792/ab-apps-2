import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  type ListItemProps,
  type ListProps,
  Typography,
} from "@mui/material";
import ExpandIconButton from "@/components/buttons/ExpandIconButton";

const NestedList = ({ items, ...props }: ListProps & { items: ListItem[] }) => {
  return (
    <List disablePadding dense {...props}>
      {items
        .filter(({ render }) => render !== false)
        .map((item) => (
          <NestedListItem key={item.id} item={item} />
        ))}
    </List>
  );
};

const NestedListItem = ({
  item,
  ...props
}: ListItemProps & { item: ListItem }) => {
  const [expanded, setExpanded] = useState(false);

  /** Values */

  const hasChildren =
    item.items?.some(({ render }) => render !== false) ?? false;

  /** Effects */

  useEffect(() => {
    setExpanded(!!item.expanded);
  }, [item.expanded]);

  return (
    <>
      <ListItem
        disablePadding
        {...(hasChildren && {
          secondaryAction: (
            <ExpandIconButton
              expanded={item.expanded || expanded}
              onChange={setExpanded}
            />
          ),
        })}
        {...props}
      >
        <ListItemButton
          selected={item.selected}
          disabled={item.disabled}
          {...(item.link && { LinkComponent: Link, ...item.link })}
          onClick={item.onClick}
        >
          {!!item.icon && (
            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
          )}
          <ListItemText>
            <Typography
              variant="body2"
              fontWeight={item.selected ? 600 : 500}
              noWrap
            >
              {item.label}
            </Typography>
          </ListItemText>
        </ListItemButton>
      </ListItem>

      {hasChildren && (
        <Collapse in={expanded}>
          <NestedList
            component="div"
            items={item.items ?? []}
            sx={{ "li > *": { pl: 4 } }}
          />
        </Collapse>
      )}
    </>
  );
};

export default NestedList;
