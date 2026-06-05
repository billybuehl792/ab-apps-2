import { type ReactNode } from "react";
import { Stack, type StackProps } from "@mui/material";

interface IPageHeaderProps extends Omit<StackProps, "title"> {
  title: ReactNode;
  endContent?: ReactNode;
}

const PageHeader: React.FC<IPageHeaderProps> = ({
  title,
  endContent,
  ...props
}) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
      height={(theme) => theme.layout.page.header.height}
      boxSizing="border-box"
      bgcolor="background.paper"
      borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
      {...props}
    >
      {title}
      {endContent}
    </Stack>
  );
};

export default PageHeader;
