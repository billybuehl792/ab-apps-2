import type { ReactNode } from "react";
import {
  Box,
  Stack,
  Tooltip,
  Typography,
  type TypographyProps,
  type StackProps,
} from "@mui/material";

interface IMetadataProps extends StackProps {
  items: IMetadataItem[];
  slotProps?: {
    item?: StackProps;
    label?: TypographyProps;
    value?: TypographyProps;
  };
}

export interface IMetadataItem extends StackProps {
  id: string;
  label: ReactNode;
  value: ReactNode;
  tooltip?: ReactNode;
  render?: boolean;
  slotProps?: {
    label?: TypographyProps;
    value?: TypographyProps;
  };
}

const Metadata: React.FC<IMetadataProps> = ({ items, slotProps, ...props }) => {
  return (
    <Stack {...props}>
      {items
        .filter((item) => item.render !== false)
        .map((item) => (
          <MetadataItem key={item.id} {...item} {...slotProps?.item} />
        ))}
    </Stack>
  );
};

const MetadataItem: React.FC<IMetadataItem> = ({
  render,
  label,
  value,
  tooltip,
  slotProps,
  ...props
}) => {
  /** Components */

  const ValueComponent =
    typeof value === "string" || typeof value === "number" ? (
      <Typography variant="caption" noWrap {...slotProps?.value}>
        {value}
      </Typography>
    ) : (
      <Box component="span">{value}</Box>
    );

  if (render === false) return null;
  return (
    <Stack direction="row" spacing={1} alignItems="center" {...props}>
      {/* Label */}
      {typeof label === "string" || typeof label === "number" ? (
        <Typography variant="caption" noWrap {...slotProps?.label}>
          {label}:
        </Typography>
      ) : (
        label
      )}

      {/* Value */}
      {tooltip ? (
        <Tooltip title={tooltip}>{ValueComponent}</Tooltip>
      ) : (
        ValueComponent
      )}
    </Stack>
  );
};

export default Metadata;
