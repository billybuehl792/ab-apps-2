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

interface NestedListProps extends ListProps {
  items: ListItem[];
  slotProps?: {
    item?: Partial<Omit<NestedListItemProps, "item">>;
  };
}

interface NestedListItemProps extends ListItemProps {
  item: ListItem;
}

const NestedList = ({ items, ...props }: NestedListProps) => {
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

const NestedListItem = ({ item, ...props }: NestedListItemProps) => {
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
          sx={{
            '&[data-status="active"]': {
              backgroundColor: "action.selected",
              "> *": { fontWeight: "bold", color: "text.primary" },
            },
          }}
        >
          {!!item.Icon && (
            <ListItemIcon sx={{ minWidth: 36 }}>{<item.Icon />}</ListItemIcon>
          )}
          <ListItemText>
            <Typography variant="body2" fontWeight="inherit" noWrap>
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
