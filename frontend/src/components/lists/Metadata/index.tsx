import {
  Box,
  Stack,
  Tooltip,
  Typography,
  type TypographyProps,
  type StackProps,
} from "@mui/material";

interface IMetadataProps<
  TOptions extends MenuOption[] = MenuOption[],
> extends StackProps {
  items: TOptions;
  slotProps?: {
    item?: StackProps;
    label?: TypographyProps;
    value?: TypographyProps;
  };
}

const Metadata = <TOptions extends MenuOption[]>({
  items,
  slotProps,
  ...props
}: IMetadataProps<TOptions>) => {
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
            <Tooltip title={item.tooltip ?? item.value}>
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
