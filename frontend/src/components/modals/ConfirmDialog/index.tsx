import { type ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  type DialogProps,
  DialogTitle,
  Stack,
} from "@mui/material";
import CloseIconButton from "@/components/buttons/CloseIconButton";

export interface ConfirmOptions {
  title?: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  confirmButtonText?: ReactNode;
  cancelButtonText?: ReactNode;
}

interface ConfirmDialogProps
  extends Omit<DialogProps, "title" | "content" | "onClose">,
    ConfirmOptions {
  onConfirm: VoidFunction;
  onClose: VoidFunction;
}

const ConfirmDialog = ({
  title,
  description,
  content,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onClose,
  ...props
}: ConfirmDialogProps) => {
  return (
    <Dialog
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      onClose={onClose}
      {...props}
    >
      <DialogTitle
        id="alert-dialog-title"
        component={Stack}
        direction="row"
        justifyContent="space-between"
      >
        {title}
        {!!onClose && <CloseIconButton onClick={onClose} />}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description ?? "Are you sure you want to continue?"}
        </DialogContentText>
        {typeof content === "string" ? (
          <DialogContentText>{content}</DialogContentText>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="error" onClick={onClose}>
          {cancelButtonText ?? "Cancel"}
        </Button>
        <Button onClick={onConfirm} autoFocus>
          {confirmButtonText ?? "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
