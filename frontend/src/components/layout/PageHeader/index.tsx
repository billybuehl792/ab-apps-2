import { Divider, Stack, type StackProps } from "@mui/material";

interface PageHeaderProps extends StackProps {
  disableDivider?: boolean;
  slotProps?: {
    root?: StackProps;
  };
}

const PageHeader = ({
  children,
  disableDivider,
  slotProps,
  ...props
}: PageHeaderProps) => {
  return (
    <Stack
      position="sticky"
      top={0}
      p={2}
      pb={0}
      spacing={2}
      bgcolor={(theme) => theme.palette.background.paper}
      zIndex={1}
      {...slotProps?.root}
    >
      <Stack height={32} {...props}>
        {children}
      </Stack>
      {!disableDivider && <Divider variant="middle" />}
    </Stack>
  );
};

export default PageHeader;
