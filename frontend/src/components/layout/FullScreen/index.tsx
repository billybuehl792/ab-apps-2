import { Stack, type StackProps } from "@mui/material";

const FullScreen = (props: StackProps) => {
  return (
    <Stack
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      alignItems="center"
      justifyContent="center"
      p={2}
      bgcolor={(theme) => theme.palette.primary.main}
      color={(theme) => theme.palette.primary.contrastText}
      {...props}
    />
  );
};

export default FullScreen;
