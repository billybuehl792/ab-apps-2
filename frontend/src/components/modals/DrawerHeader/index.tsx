import { type ReactNode } from "react";
import { Divider, Stack, type StackProps, Typography } from "@mui/material";
import CloseIconButton from "@/components/buttons/CloseIconButton";
import BackIconButton from "@/components/buttons/BackIconButton";

interface DrawerHeaderProps extends Omit<StackProps, "title"> {
  title: ReactNode;
  onClose?: VoidFunction;
  onBack?: VoidFunction;
}

const DrawerHeader = ({
  title,
  onClose,
  onBack,
  ...props
}: DrawerHeaderProps) => {
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        px={2}
        py={1.5}
        {...props}
      >
        <Stack direction="row">
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
    </>
  );
};

export default DrawerHeader;
