import { type JSX } from "react";
import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  type StackProps,
  Typography,
} from "@mui/material";
import {
  ErrorOutline,
  FolderOff,
  type SvgIconComponent,
} from "@mui/icons-material";
import { errorUtils } from "@/store/utils/error";

interface StatusCardProps extends StackProps {
  Icon?: SvgIconComponent;
  label?: JSX.Element | string;
  description?: JSX.Element | string;
  loading?: boolean | string | JSX.Element;
  error?: boolean | string | Error | null | JSX.Element;
  empty?: boolean | string | JSX.Element;
}

const StatusCard = ({
  children,
  Icon,
  label,
  description,
  loading,
  error,
  empty,
  ...props
}: StatusCardProps) => {
  /** Values */

  const isLoading = !!loading;
  const isError = !!error;
  const isEmpty = !!empty;

  const loadingMessage = isLoading
    ? typeof loading === "string"
      ? loading
      : null
    : null;
  const errorMessage = isError ? errorUtils.getErrorMessage(error) : null;
  const emptyMessage = isEmpty
    ? typeof empty === "string"
      ? empty
      : "No Results"
    : null;

  const message = loadingMessage || errorMessage || emptyMessage;

  const LabelComponent =
    typeof label === "string" ? (
      <Typography variant="body2">{label}</Typography>
    ) : (
      label
    );

  const DescriptionComponent =
    typeof description === "string" ? (
      <Typography variant="body2">{description}</Typography>
    ) : (
      description
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
            {Icon ??
              (isLoading ? (
                <CircularProgress />
              ) : isError ? (
                <ErrorOutline fontSize="large" color="error" />
              ) : isEmpty ? (
                <FolderOff fontSize="large" color="disabled" />
              ) : null)}
            {message && (
              <Typography
                component="span"
                variant="body2"
                color={isError ? "error" : "text.disabled"}
                textAlign="center"
                sx={{ wordBreak: "break-word" }}
              >
                {message}
              </Typography>
            )}
            {LabelComponent}
            {!!DescriptionComponent && (
              <>
                <Divider sx={{ width: "100%" }} />
                {DescriptionComponent}
              </>
            )}
          </>
        )}
      </CardContent>
    </Stack>
  );
};

export default StatusCard;
