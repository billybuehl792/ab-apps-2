import {
  Box,
  Container,
  type ContainerProps,
  type BoxProps,
} from "@mui/material";
import { sxUtils } from "@/store/utils/sx";

interface IFullScreenProps extends Omit<BoxProps, "maxWidth"> {
  maxWidth?: ContainerProps["maxWidth"];
  slotProps?: {
    root?: BoxProps;
    content?: BoxProps;
    container?: ContainerProps;
  };
}

const FullScreen: React.FC<IFullScreenProps> = ({
  children,
  maxWidth = "sm",
  slotProps,
  ...props
}) => {
  return (
    <Box
      position="absolute"
      display="block"
      top={0}
      left={0}
      right={0}
      bottom={0}
      width="100vw"
      height="100vh"
      bgcolor="primary.main"
      color="primary.contrastText"
      overflow="hidden"
      {...slotProps?.root}
      {...props}
      sx={[
        {
          scrollbarColor: (theme) =>
            `${theme.palette.primary.contrastText} transparent`,
        },
        ...sxUtils.asArray(props?.sx),
        ...sxUtils.asArray(slotProps?.root?.sx),
      ]}
    >
      <Box
        position="relative"
        display="block"
        width="100%"
        minHeight="100%"
        maxHeight="100%"
        top={0}
        left={0}
        overflow="auto"
        {...slotProps?.content}
      >
        <Container
          maxWidth={maxWidth}
          {...slotProps?.container}
          sx={[
            { py: 2, transform: "translateY(max(calc(50vh - 50%), 0px))" },
            ...sxUtils.asArray(slotProps?.container?.sx),
          ]}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default FullScreen;
