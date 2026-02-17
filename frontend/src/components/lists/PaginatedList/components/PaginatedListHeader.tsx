import { type ComponentProps, type ReactNode } from "react";
import { type StackProps, Stack } from "@mui/material";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import { sxUtils } from "@/store/utils/sx";
import type { TListRequest } from "@/store/types/api";

interface IPaginatedListHeaderProps extends StackProps {
  params: TListRequest["params"];
  loading?: boolean;
  disabled?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  bottomContent?: ReactNode;
  disableDivider?: boolean;
  onSearchChange?: (value: string) => void;
  slotProps?: {
    root?: StackProps;
    content?: StackProps;
    mainContent?: StackProps;
    searchField?: Partial<ComponentProps<typeof DebouncedSearchField>>;
  };
}

const PaginatedListHeader: React.FC<IPaginatedListHeaderProps> = ({
  params,
  loading,
  disabled,
  startContent,
  endContent,
  bottomContent,
  disableDivider,
  onSearchChange,
  slotProps,
  ...props
}) => {
  return (
    <Stack
      {...props}
      {...slotProps?.root}
      sx={[
        !disableDivider && {
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        },
        ...sxUtils.asArray(props?.sx),
        ...sxUtils.asArray(slotProps?.root?.sx),
      ]}
    >
      <Stack spacing={1} flexGrow={1} py={2} {...slotProps?.content}>
        <Stack direction="row" spacing={1} {...slotProps?.mainContent}>
          {startContent}
          <DebouncedSearchField
            value={params.search}
            size="small"
            loading={loading && !!params.search}
            disabled={disabled || !onSearchChange}
            onChange={(...searchArgs) => onSearchChange?.(...searchArgs)}
            {...slotProps?.searchField}
          />
          {endContent}
        </Stack>
        {bottomContent}
      </Stack>
    </Stack>
  );
};

export default PaginatedListHeader;
