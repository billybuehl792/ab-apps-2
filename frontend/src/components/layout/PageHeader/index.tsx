import { Stack, type StackProps } from "@mui/material";

const PageHeader = (props: StackProps) => {
  return (
    <Stack
      position="sticky"
      spacing={2}
      boxSizing="border-box"
      top={0}
      py={2}
      mx={2}
      bgcolor={(theme) => theme.palette.background.paper}
      zIndex={1}
      borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
      {...props}
    />
  );
};

export default PageHeader;
