import React, { type ReactNode } from "react";
import {
  AppBar,
  Container,
  Dialog,
  Toolbar,
  Typography,
  type DialogProps,
} from "@mui/material";
import CloseIconButton from "@/components/buttons/CloseIconButton";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";

export interface IFullScreenDialogProps extends Omit<
  DialogProps,
  "fullScreen"
> {
  label?: ReactNode;
  options?: IMenuOption[];
}

const FullScreenDialog: React.FC<IFullScreenDialogProps> = ({
  label,
  options,
  children,
  onClose,
  ...props
}) => {
  return (
    <Dialog fullScreen onClose={onClose} {...props}>
      <AppBar>
        <Toolbar>
          {typeof label === "string" || typeof label === "number" ? (
            <Typography variant="h6" noWrap>
              {label}
            </Typography>
          ) : (
            label
          )}
          {!!options?.length && <MenuOptionIconButton options={options} />}
          <CloseIconButton
            color="inherit"
            onClick={(event) => onClose?.(event, "backdropClick")}
            sx={{ ml: "auto" }}
          />
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        {children}
      </Container>
    </Dialog>
  );
};

export default FullScreenDialog;
