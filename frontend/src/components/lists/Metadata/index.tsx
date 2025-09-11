import { type ReactNode } from "react";
import {
  Box,
  Stack,
  Tooltip,
  Typography,
  TypographyProps,
  type StackProps,
} from "@mui/material";

interface Item {
  id: string;
  render?: boolean;
  label: ReactNode;
  value: ReactNode;
  tooltip?: ReactNode;
}

interface MetadataProps extends StackProps {
  items: Item[];
  slotProps?: {
    label?: TypographyProps;
    value?: TypographyProps;
  };
}

const Metadata = ({ items, slotProps, ...props }: MetadataProps) => {
  return (
    <Stack {...props}>
      {items
        .filter((item) => item.render !== false)
        .map((item) => (
          <Stack key={item.id} direction="row" spacing={1} alignItems="center">
            {typeof item.label === "string" ? (
              <Typography variant="caption" noWrap {...slotProps?.label}>
                {item.label}:
              </Typography>
            ) : (
              item.label
            )}
            <Tooltip title={item.tooltip}>
              {typeof item.value === "string" ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={400}
                  {...slotProps?.value}
                >
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
