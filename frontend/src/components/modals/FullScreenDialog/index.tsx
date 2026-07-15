import React, { useState, type ReactNode } from "react";
import {
  alpha,
  AppBar,
  Container,
  Dialog,
  Skeleton,
  styled,
  Toolbar,
  Typography,
  type DialogProps,
} from "@mui/material";
import StatusWrapper, {
  type IStatusWrapperBaseProps,
} from "@/components/layout/StatusWrapper";
import CloseIconButton from "@/components/buttons/CloseIconButton";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import theme from "@/store/config/theme";

export interface IFullScreenDialogProps
  extends Omit<DialogProps, "fullScreen">, IStatusWrapperBaseProps {
  label?: ReactNode;
  options?: IMenuOption[];
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: alpha(theme.palette.common.black, 0.6),
  },
  "& .MuiContainer-root": {
    position: "relative",
    display: "flex",
    top: theme.layout.nav.height,
    height: `calc(100% - ${theme.layout.nav.height}px)`,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const FullScreenDialog: React.FC<IFullScreenDialogProps> = ({
  open,
  label,
  options,
  children,
  loading,
  error,
  empty,
  onClose,
  ...props
}) => {
  /** Values */

  const [closing, setClosing] = useState(false);

  /* Callbacks */

  const handleOnClose: DialogProps["onClose"] = (event, reason) => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose?.(event, reason);
    }, theme.transitions.duration.leavingScreen);
  };

  return (
    <StyledDialog
      open={open && !closing}
      fullScreen
      onClose={handleOnClose}
      {...props}
    >
      <AppBar color="inherit">
        <Toolbar>
          {loading ? (
            <Skeleton variant="text" width={100} />
          ) : !!error || !!empty ? (
            "-"
          ) : typeof label === "string" || typeof label === "number" ? (
            <Typography variant="h6" noWrap>
              {label}
            </Typography>
          ) : (
            label
          )}
          {!!options?.length && (
            <MenuOptionIconButton
              options={options}
              loading={!!loading}
              color="inherit"
              sx={{ ml: 1 }}
            />
          )}
          <CloseIconButton
            color="inherit"
            onClick={(event) => handleOnClose?.(event, "backdropClick")}
            sx={{ ml: "auto" }}
          />
        </Toolbar>
      </AppBar>
      <Container>
        <StatusWrapper
          loading={loading}
          error={error}
          empty={empty}
          flexGrow={1}
        >
          {children}
        </StatusWrapper>
      </Container>
    </StyledDialog>
  );
};

export default FullScreenDialog;
