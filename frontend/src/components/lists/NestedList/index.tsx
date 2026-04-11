import { useState, useEffect, Fragment } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  type ListItemProps,
  type ListProps,
  Typography,
  ListItemButton,
} from "@mui/material";
import ExpandIconButton from "@/components/buttons/ExpandIconButton";
import ListItemButtonLink from "@/components/links/ListItemButtonLink";
import { sxUtils } from "@/store/utils/sx";

export interface INestedListProps extends ListProps {
  items: IListItem[];
  slotProps?: {
    item?: Partial<Omit<INestedListItemProps, "item">>;
  };
}

interface INestedListItemProps extends ListItemProps {
  item: IListItem;
}

const NestedList: React.FC<INestedListProps> = ({
  items,
  slotProps,
  ...props
}) => {
  return (
    <List disablePadding dense {...props}>
      {items
        .filter(({ render }) => render !== false)
        .map((item) => (
          <NestedListItem key={item.id} item={item} {...slotProps?.item} />
        ))}
    </List>
  );
};

const NestedListItem: React.FC<INestedListItemProps> = ({ item, ...props }) => {
  const [expanded, setExpanded] = useState(false);

  /** Values */

  const location = useLocation();
  const hasChildren =
    item.items?.some(({ render }) => render !== false) ?? false;

  const ListItemContent = (
    <Fragment>
      {(!!item.icon || !!item.Icon) && (
        <ListItemIcon>{item.Icon ? <item.Icon /> : item.icon}</ListItemIcon>
      )}
      <ListItemText>
        <Typography variant="body2" fontWeight="inherit" noWrap>
          {item.label}
        </Typography>
      </ListItemText>
    </Fragment>
  );

  /** Callbacks */

  const handleOnExpandChange = (newExpanded: boolean) => {
    setExpanded(newExpanded);
    item.onExpandChange?.(newExpanded);
  };

  /** Effects */

  useEffect(() => {
    if (typeof item.expanded === "boolean") handleOnExpandChange(item.expanded);
  }, [item.expanded]);

  useEffect(() => {
    if (!hasChildren || !item.link?.to) return;
    const isChildPath = location.pathname.startsWith(item.link.to);
    if (isChildPath) {
      const isExactPath = location.pathname === item.link.to;
      if (!isExactPath) handleOnExpandChange(true);
    }
  }, [location.pathname, item.link?.to, hasChildren]);

  return (
    <>
      <ListItem
        disablePadding
        {...(hasChildren && {
          secondaryAction: (
            <ExpandIconButton
              expanded={expanded}
              onChange={handleOnExpandChange}
            />
          ),
        })}
        {...props}
        sx={[...sxUtils.asArray(item.sx), ...sxUtils.asArray(props.sx)]}
      >
        {item.link ? (
          <ListItemButtonLink
            {...item.link}
            selected={item.selected}
            disabled={item.disabled}
            onClick={item.onClick}
          >
            {ListItemContent}
          </ListItemButtonLink>
        ) : item.onClick || hasChildren ? (
          <ListItemButton
            selected={item.selected}
            disabled={item.disabled}
            onClick={item.onClick}
          >
            {ListItemContent}
          </ListItemButton>
        ) : (
          ListItemContent
        )}
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
