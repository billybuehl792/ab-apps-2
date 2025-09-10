import { type ReactNode } from "react";
import { Stack, Tooltip, Typography, type StackProps } from "@mui/material";

interface Item {
  id: string;
  render?: boolean;
  label: ReactNode;
  value: ReactNode;
  tooltip?: ReactNode;
}

interface MetadataProps extends StackProps {
  items: Item[];
}

const Metadata = ({ items, ...props }: MetadataProps) => {
  return (
    <Stack {...props}>
      {items
        .filter((item) => item.render !== false)
        .map((item) => (
          <Stack key={item.id} direction="row" spacing={1} alignItems="center">
            {typeof item.label === "string" ? (
              <Typography variant="caption" noWrap>
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
                >
                  {item.value}
                </Typography>
              ) : (
                <>{item.value}</>
              )}
            </Tooltip>
          </Stack>
        ))}
    </Stack>
  );
};

export default Metadata;
