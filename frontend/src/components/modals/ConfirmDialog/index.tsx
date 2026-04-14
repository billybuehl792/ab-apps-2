import { type ReactNode } from "react";
import {
  Box,
  Button,
  type ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  type DialogProps,
  DialogTitle,
  Stack,
} from "@mui/material";
import CloseIconButton from "@/components/buttons/CloseIconButton";

export interface IConfirmOptions {
  title?: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  confirmButton?: ButtonProps;
  cancelButton?: ButtonProps;
}

interface IConfirmDialogProps
  extends Omit<DialogProps, "title" | "content" | "onClose">, IConfirmOptions {
  onConfirm: VoidFunction;
  onClose: VoidFunction;
}

const ConfirmDialog: React.FC<IConfirmDialogProps> = ({
  title = "Confirm",
  description = "Are you sure you want to continue?",
  content,
  confirmButton,
  cancelButton,
  onConfirm,
  onClose,
  ...props
}) => {
  return (
    <Dialog
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="xs"
      onClose={onClose}
      {...props}
    >
      <DialogTitle
        id="alert-dialog-title"
        component={Stack}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          component="span"
          sx={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Box>
        <CloseIconButton onClick={onClose} sx={{ flexShrink: 0 }} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" textAlign="center">
          {description}
        </DialogContentText>
        {typeof content === "string" || typeof content === "number" ? (
          <DialogContentText>{content}</DialogContentText>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="error"
          children="Cancel"
          onClick={onClose}
          {...cancelButton}
        />
        <Button
          autoFocus
          children="Confirm"
          onClick={onConfirm}
          {...confirmButton}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
