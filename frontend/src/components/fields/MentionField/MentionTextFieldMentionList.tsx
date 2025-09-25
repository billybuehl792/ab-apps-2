import { Editor, useEditorState } from "@tiptap/react";
import { Stack, type StackProps } from "@mui/material";
import ClientChip from "@/containers/chips/ClientChip";

interface MentionTextFieldMentionListProps extends StackProps {
  editor: Editor;
}

const MentionTextFieldMentionList = ({
  editor,
  ...props
}: MentionTextFieldMentionListProps) => {
  /** Values */

  const mentions = useEditorState({
    editor,
    selector: (state) => {
      const mentions = new Set<number>();
      state.editor.state.doc.descendants((node) => {
        if (node.type.name === "mention") mentions.add(Number(node.attrs.id));
      });

      return mentions;
    },
  });

  if (mentions.size === 0) return null;
  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" {...props}>
      {Array.from(mentions).map((id) => (
        <ClientChip key={id} client={id} size="xs" />
      ))}
    </Stack>
  );
};

export default MentionTextFieldMentionList;
