import React from "react";
import { CircularProgress, Stack, type StackProps } from "@mui/material";
import { ErrorOutline, FolderOff } from "@mui/icons-material";
import StatusCard, {
  type IStatusCardProps,
} from "@/components/cards/StatusCard";
import { errorUtils } from "@/store/utils/error";
import type { IStatus } from "@/components/cards/StatusCard/components/Status";

export interface IStatusWrapperProps extends StackProps {
  loading?: boolean | string | number | IStatus;
  error?: boolean | string | Error | null | IStatus;
  empty?: boolean | string | IStatus;
  slotProps?: { card?: IStatusCardProps };
}

const getLoadingStatusValue = (
  loading: IStatusWrapperProps["loading"],
): IStatus => ({
  icon: <CircularProgress size={40} color="inherit" />,
  color: "text.disabled",
  ...(typeof loading === "string" && { label: loading }),
  ...(typeof loading === "object" && loading),
});

const getErrorStatusValue = (error: IStatusWrapperProps["error"]): IStatus => ({
  label: "Something went wrong",
  icon: <ErrorOutline fontSize="large" />,
  color: "error.main",
  ...(typeof error === "string" && { label: error }),
  ...(!!error &&
    typeof error === "object" &&
    (error instanceof Error
      ? { description: errorUtils.getErrorMessage(error) }
      : error)),
});

const getEmptyStatusValue = (empty: IStatusWrapperProps["empty"]): IStatus => ({
  label: "No Results",
  color: "text.disabled",
  icon: <FolderOff fontSize="large" />,
  ...(typeof empty === "string" && { label: empty }),
  ...(typeof empty === "object" && empty),
});

/**
 * This component renders a `StatusCard` component based on the `loading`, `error`, and `empty` props.
 *
 * __Precedence of states (from highest to lowest):__
 * 1. `loading`
 * 2. `error`
 * 3. `empty`
 */
const StatusWrapper: React.FC<IStatusWrapperProps> = ({
  children,
  loading,
  error,
  empty,
  slotProps,
  ...props
}) => {
  if (loading || error || empty) {
    return (
      <Stack spacing={1} {...props}>
        <StatusCard
          value={
            loading
              ? getLoadingStatusValue(loading)
              : error
                ? getErrorStatusValue(error)
                : getEmptyStatusValue(empty)
          }
          {...slotProps?.card}
        />
      </Stack>
    );
  }
  return children;
};

export default StatusWrapper;
