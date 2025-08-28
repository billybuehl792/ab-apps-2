import { type ReactNode } from "react";
import {
  Card,
  CardContent,
  type CardProps,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ErrorOutline, FolderOff } from "@mui/icons-material";

interface StatusCardProps extends Omit<CardProps, "content"> {
  loading?: true | string | ReactNode;
  error?: true | string | Error | ReactNode;
  empty?: true | string | ReactNode;
  content?: ReactNode | string;
  description?: ReactNode | string;
  icon?: ReactNode;
}

const StatusCard = ({
  children,
  loading,
  error,
  empty,
  icon: iconProp,
  description,
  content,
  ...props
}: StatusCardProps) => {
  /** Values */

  const isLoading = !!loading;
  const isError = !!error;
  const isEmpty = !!empty;

  const icon =
    iconProp ??
    (isLoading ? (
      <CircularProgress />
    ) : isError ? (
      <ErrorOutline fontSize="large" color="error" />
    ) : isEmpty ? (
      <FolderOff fontSize="large" color="disabled" />
    ) : null);

  const loadingMessage = isLoading
    ? typeof loading === "string"
      ? loading
      : null
    : null;
  const errorMessage = isError
    ? typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : "An unexpected error occurred."
    : null;
  const emptyMessage = isEmpty
    ? typeof empty === "string"
      ? empty
      : "No Results"
    : null;

  const message = loadingMessage || errorMessage || emptyMessage;

  const DescriptionComponent =
    typeof description === "string" ? (
      <Typography variant="body2">{description}</Typography>
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
    <Stack component={Card} {...props}>
      <CardContent
        component={Stack}
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        {children ?? (
          <>
            {icon}
            {message && (
              <Typography
                component="span"
                color={isError ? "error" : "text.disabled"}
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
    </Stack>
  );
};

export default StatusCard;
