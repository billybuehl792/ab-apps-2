import {
  Box,
  Stack,
  Tooltip,
  Typography,
  type TypographyProps,
  type StackProps,
} from "@mui/material";
import { isValidElement, ReactNode } from "react";

export interface IMetadataItem {
  id: string;
  label: ReactNode;
  value: ReactNode;
  tooltip?: ReactNode;
  render?: boolean;
}

interface IMetadataProps extends StackProps {
  items: IMetadataItem[];
  slotProps?: {
    item?: StackProps;
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
          <Stack
            key={item.id}
            direction="row"
            spacing={1}
            alignItems="center"
            {...slotProps?.item}
          >
            {typeof item.label === "string" ||
            typeof item.label === "number" ? (
              <Typography variant="caption" noWrap {...slotProps?.label}>
                {item.label}:
              </Typography>
            ) : (
              item.label
            )}
            <Tooltip
              title={
                item?.tooltip ||
                typeof item.value === "string" ||
                typeof item.value === "number"
                  ? String(item.value)
                  : null
              }
            >
              {typeof item.value === "string" ||
              typeof item.value === "number" ? (
                <Typography variant="caption" noWrap {...slotProps?.value}>
                  {item.value}
                </Typography>
              ) : (
                <Box component="span">{item.value}</Box>
              )}
            </Tooltip>
          </Stack>
        ))}
    </Stack>
  );
};

export default Metadata;
