import { type ReactNode } from "react";
import { Stack, Typography, type StackProps } from "@mui/material";

interface Item {
  id: string;
  label: ReactNode;
  value: ReactNode;
}

interface MetadataProps extends StackProps {
  items: Item[];
}

const Metadata = ({ items, ...props }: MetadataProps) => {
  return (
    <Stack {...props}>
      {items.map((item) => (
        <Stack key={item.id} direction="row" spacing={1} alignItems="center">
          {typeof item.label === "string" ? (
            <Typography variant="caption" noWrap>
              {item.label}:
            </Typography>
          ) : (
            item.label
          )}
          {typeof item.value === "string" ? (
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={400}
            >
              {item.value}
            </Typography>
          ) : (
            item.value
          )}
        </Stack>
      ))}
    </Stack>
  );
};

export default Metadata;
