import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from "@tiptap/suggestion";
import { type MentionNodeAttrs } from "@tiptap/extension-mention";
import { MenuItem, MenuList, Paper, Popper } from "@mui/material";
import { clientQueries } from "@/store/queries/clients";
import ClientMenuItem from "@/containers/menu-items/ClientMenuItem";
import type { ClientBasic } from "@/store/types/clients";

export interface MentionListHandle {
  onKeyDown: (props: SuggestionKeyDownProps) => void;
}

const MentionTextFieldList = forwardRef<
  MentionListHandle,
  SuggestionProps<MentionNodeAttrs>
>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  /** Values */

  const clientRect = props.clientRect?.();
  const anchorEl = clientRect
    ? { getBoundingClientRect: () => clientRect }
    : null;

  const [search] = useDebounce(props.query ?? "", 300);

  /** Queries */

  const clientListQuery = useQuery(clientQueries.list({ search }));

  /** Callbacks */

  const handleAddMention = (client: ClientBasic) =>
    props.command({ id: client.id, label: client.full_name });

  const handleArrowKey = (direction: "up" | "down") => {
    const count = clientListQuery.data?.count ?? 0;
    if (direction === "up")
      setSelectedIndex((selectedIndex + count - 1) % count);
    else setSelectedIndex((selectedIndex + 1) % count);
  };

  /** Handlers */

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        handleArrowKey("up");
        return true;
      }

      if (event.key === "ArrowDown") {
        handleArrowKey("down");
        return true;
      }

      if (event.key === "Enter") {
        const client = clientListQuery.data?.results[selectedIndex];
        if (client) handleAddMention(client);
        return true;
      }

      return false;
    },
  }));

  /** Effects */

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <Popper
      open={true}
      anchorEl={anchorEl}
      placement="bottom-start"
      sx={{ zIndex: ({ zIndex }) => zIndex.modal }}
    >
      <Paper>
        <MenuList dense autoFocus={false}>
          {clientListQuery.isLoading && (
            <MenuItem disabled>Loading...</MenuItem>
          )}
          {clientListQuery.isError && (
            <MenuItem disabled color="error">
              Error
            </MenuItem>
          )}
          {clientListQuery.isSuccess &&
            (clientListQuery.data.count === 0 ? (
              <MenuItem disabled>No results</MenuItem>
            ) : (
              clientListQuery.data.results.map((client, index) => (
                <ClientMenuItem
                  key={client.id}
                  client={client}
                  selected={selectedIndex === index}
                  onClick={() => handleAddMention(client)}
                />
              ))
            ))}
        </MenuList>
      </Paper>
    </Popper>
  );
});

MentionTextFieldList.displayName = "MentionTextFieldList";

export default MentionTextFieldList;
