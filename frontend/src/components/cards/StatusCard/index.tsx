import { type JSX } from "react";
import {
  Card,
  CardContent,
  type CardProps,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

interface StatusCardProps extends Omit<CardProps, "content"> {
  loading?: boolean | string | JSX.Element;
  error?: boolean | string | Error | JSX.Element;
  content?: JSX.Element | string;
  description?: JSX.Element | string;
  icon?: JSX.Element;
}

const StatusCard = ({
  children,
  loading,
  error,
  icon: iconProp,
  description,
  content,
  ...props
}: StatusCardProps) => {
  /** Values */

  const icon =
    iconProp ??
    (loading ? (
      <CircularProgress />
    ) : error ? (
      <ErrorOutline fontSize="large" color="error" />
    ) : null);

  const errorMessage =
    !!error &&
    (typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : typeof error === "boolean" && "An unexpected error occurred.");

  const loadingMessage = !!loading && typeof loading === "string" && loading;

  const message = loadingMessage || errorMessage;

  const DescriptionComponent =
    typeof description === "string" ? (
      <Typography variant="caption">{description}</Typography>
    ) : (
      description
    );

  const ContentComponent =
    typeof content === "string" ? (
      <Typography variant="body2">{content}</Typography>
    ) : (
      content
    );

  return (
    <Card variant="outlined" {...props}>
      <CardContent
        component={Stack}
        spacing={1}
        alignItems="center"
        minWidth={420}
      >
        {children ?? (
          <>
            {icon}
            {message && (
              <Typography
                component="span"
                color="error"
                textAlign="center"
                sx={{ wordBreak: "break-word" }}
              >
                {message}
              </Typography>
            )}
            {DescriptionComponent}
            {!!ContentComponent && (
              <>
                <Divider sx={{ width: "100%" }} />
                {ContentComponent}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard;
