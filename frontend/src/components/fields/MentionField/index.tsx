import {
  Editor,
  EditorContent,
  mergeAttributes,
  ReactRenderer,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Box, Stack, styled } from "@mui/material";
import MentionTextFieldList, {
  type MentionListHandle,
} from "./MentionTextFieldList";

interface MentionFieldProps {
  value?: string;
  onChange?: (text: string, editor: Editor) => void;
}

const MentionContainer = styled(Box)(({ theme }) => ({
  "& > div:first-of-type": {
    width: "100%",
    height: "auto",
    minHeight: "inherit",
    overflow: "hidden",
  },
  "& .ProseMirror": {
    width: "100%",
    minHeight: "100px",
    maxHeight: "300px",
    overflowY: "auto",
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: 1,
    backgroundColor: theme.palette.background.paper,
    boxSizing: "border-box",
    whiteSpace: "pre-wrap",
    outline: "none",
    resize: "vertical",
    ...theme.typography.body1,
    "&:hover": {
      borderColor: "primary.main",
    },
    "&:focus-visible": {
      outline: `${theme.palette.primary.main} auto 1px`,
    },
    "& .mention-tag": {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
    "p.is-editor-empty:first-of-type::before": {
      content: "attr(data-placeholder)",
      float: "left",
      color: theme.palette.text.secondary,
      pointerEvents: "none",
      height: 0,
    },
  },
}));

const MentionField = ({ value, onChange }: MentionFieldProps) => {
  /** Values */

  const editor = useEditor({
    content: value ?? "",
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something ...",
      }),
      Mention.configure({
        HTMLAttributes: { class: "mention" },
        deleteTriggerWithBackspace: true,
        renderHTML: ({ options, node }) => {
          return [
            "span",
            mergeAttributes({ class: "mention-tag" }, options.HTMLAttributes),
            `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
          ];
        },
        suggestion: {
          char: "@",
          startOfLine: false,
          render: () => {
            let component: ReactRenderer<MentionListHandle>;

            return {
              onStart: (props) => {
                component = new ReactRenderer(MentionTextFieldList, {
                  editor: props.editor,
                  props,
                });
                component.render();
              },
              onKeyDown: (props) => {
                if (props.event.key === "Escape") {
                  component.destroy();
                  return true;
                }

                return component.ref?.onKeyDown(props) ?? false;
              },
              onUpdate: (props) => component.updateProps(props),
              onExit: () => component.destroy(),
            };
          },
        },
      }),
    ],
    onUpdate: (props) => {
      onChange?.(props.editor.getText(), props.editor);
    },
  });

  if (!editor) return null;
  return (
    <Stack spacing={1}>
      <MentionContainer>
        <EditorContent editor={editor} />
      </MentionContainer>
    </Stack>
  );
};

export default MentionField;
