import React, { Fragment, type ReactNode } from "react";
import {
  Stack,
  type StackProps,
  type SvgIconProps,
  Typography,
  type TypographyProps,
} from "@mui/material";

export interface IStatus extends StackProps {
  label?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  color?: string;
  actions?: Array<ReactNode>;
  slotProps?: {
    icon?: Partial<SvgIconProps>;
    title?: TypographyProps;
    description?: TypographyProps;
    actions?: StackProps;
  };
}

const Status: React.FC<IStatus> = ({
  children,
  label,
  description,
  icon,
  actions,
  slotProps,
  ...props
}) => (
  <Stack
    spacing={2}
    justifyContent="center"
    alignItems="center"
    minHeight={160}
    color="text.secondary"
    textAlign="center"
    {...props}
  >
    {children ?? (
      <>
        {icon}
        {(!!label || !!description) && (
          <Stack spacing={0.5}>
            {!!label && (
              <>
                {typeof label === "string" ? (
                  <Typography {...slotProps?.title}>{label}</Typography>
                ) : (
                  label
                )}
              </>
            )}
            {!!description && (
              <>
                {typeof description === "string" ? (
                  <Typography variant="caption" {...slotProps?.description}>
                    {description}
                  </Typography>
                ) : (
                  description
                )}
              </>
            )}
          </Stack>
        )}
        {!!actions?.length && (
          <Stack direction="row" spacing={1} {...slotProps?.actions}>
            {actions.map((action, index) => (
              <Fragment key={index}>{action}</Fragment>
            ))}
          </Stack>
        )}
      </>
    )}
  </Stack>
);

export default Status;
