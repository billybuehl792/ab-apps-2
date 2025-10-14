import { type ReactNode } from "react";
import clsx from "clsx";
import {
  SwipeableDrawer as MuiSwipeableDrawer,
  Stack,
  type SwipeableDrawerProps as MuiSwipeableDrawerProps,
  useMediaQuery,
  styled,
  Typography,
  Divider,
} from "@mui/material";
import BackIconButton from "@/components/buttons/BackIconButton";
import CloseIconButton from "@/components/buttons/CloseIconButton";

const iOS =
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

const StyledDrawer = styled(MuiSwipeableDrawer)(({ theme }) => ({
  ".MuiDrawer-paperAnchorRight": {
    width: 420,
  },
  "&.full-height": {
    ".MuiDrawer-paperAnchorBottom": {
      height: `calc(100vh - ${theme.spacing(8)})`,
    },
  },
  "&.puller": {
    ".MuiDrawer-paperAnchorBottom": {
      borderTopLeftRadius: +theme.shape.borderRadius * 2,
      borderTopRightRadius: +theme.shape.borderRadius * 2,
      paddingTop: theme.spacing(2),
      "&::before": {
        content: '""',
        position: "absolute",
        display: "block",
        top: theme.spacing(1),
        left: "50%",
        transform: "translateX(-50%)",
        width: 30,
        height: 3,
        borderRadius: 10,
        backgroundColor: theme.palette.grey[400],
      },
    },
  },
}));

interface DrawerProps
  extends Omit<MuiSwipeableDrawerProps, "title" | "onOpen" | "onClose"> {
  title?: ReactNode;
  fullHeight?: boolean;
  onOpen?: VoidFunction;
  onBack?: VoidFunction;
  onClose?: VoidFunction;
}

const Drawer = ({
  anchor: anchorProp = "right",
  title,
  children,
  fullHeight,
  onOpen,
  onBack,
  onClose,
  slotProps,
  className,
  ...props
}: DrawerProps) => {
  /** Values */

  const isTouch = useMediaQuery("(pointer: coarse)");
  const isSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const anchor = isTouch || !isSm ? "bottom" : anchorProp;

  return (
    <StyledDrawer
      anchor={anchor}
      disableSwipeToOpen
      disableBackdropTransition={!iOS} // iOS is hosted on high-end devices. The backdrop transition can be enabled without dropping frames. The performance will be good enough.
      disableDiscovery={iOS} // iOS has a "swipe to go back" feature that interferes with the discovery feature, so discovery has to be disabled.
      onOpen={() => onOpen?.()}
      onClose={() => onClose?.()}
      ModalProps={{ keepMounted: false }}
      slotProps={{
        ...slotProps,
        transition: {
          appear: true,
          mountOnEnter: true,
          unmountOnExit: true,
          ...slotProps?.transition,
        },
      }}
      className={clsx({
        [className ?? ""]: true,
        puller: isTouch,
        "full-height": fullHeight,
      })}
      {...props}
    >
      <Stack>
        <Stack direction="row" justifyContent="space-between" px={2} py={1.5}>
          <Stack direction="row" overflow="hidden">
            {!!onBack && <BackIconButton onClick={onBack} />}
            {typeof title === "string" ? (
              <Typography variant="h6" noWrap>
                {title}
              </Typography>
            ) : (
              title
            )}
          </Stack>
          {!!onClose && <CloseIconButton onClick={onClose} />}
        </Stack>
        <Divider variant="middle" />
      </Stack>
      <Stack flexGrow={1} overflow="auto">
        {children}
      </Stack>
    </StyledDrawer>
  );
};

export default Drawer;
