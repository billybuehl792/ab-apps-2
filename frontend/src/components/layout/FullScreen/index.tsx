import {
  Container,
  type ContainerProps,
  Stack,
  type StackProps,
} from "@mui/material";

interface FullScreenProps extends Omit<StackProps, "maxWidth"> {
  maxWidth?: ContainerProps["maxWidth"];
  slotProps?: {
    container?: ContainerProps;
  };
}

const FullScreen = ({
  children,
  maxWidth = "xs",
  slotProps,
  ...props
}: FullScreenProps) => {
  return (
    <Stack
      component="main"
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      alignItems="center"
      justifyContent="center"
      p={2}
      bgcolor="primary.main"
      color="primary.contrastText"
      {...props}
    >
      <Container maxWidth={maxWidth} {...slotProps?.container}>
        {children}
      </Container>
    </Stack>
  );
};

export default FullScreen;
