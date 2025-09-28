import { type ReactNode } from "react";
import { Stack, type StackProps } from "@mui/material";
import { PAGE_HEADER_HEIGHT } from "@/store/constants/layout";

interface PageHeaderProps extends Omit<StackProps, "title"> {
  title: ReactNode;
  endContent?: ReactNode;
}

const PageHeader = ({ title, endContent, ...props }: PageHeaderProps) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      position="sticky"
      justifyContent="space-between"
      alignItems="center"
      height={PAGE_HEADER_HEIGHT}
      boxSizing="border-box"
      top={0}
      py={2}
      bgcolor="background.paper"
      zIndex={2}
      borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
      {...props}
    >
      {title}
      {endContent}
    </Stack>
  );
};

export default PageHeader;
