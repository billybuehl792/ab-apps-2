import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  Stack,
  type StackProps,
  Typography,
} from "@mui/material";
import { SentimentDissatisfied } from "@mui/icons-material";
import BackButton from "@/containers/buttons/BackButton";

export interface IPageNotFoundCardProps extends StackProps {
  label?: ReactNode;
  description?: ReactNode;
}

const DEFAULT_LABEL = "Page Not Found";
const DEFAULT_DESCRIPTION =
  "The page you are looking for does not exist or has been moved.";

const PageNotFoundCard: React.FC<IPageNotFoundCardProps> = ({
  label = DEFAULT_LABEL,
  description = DEFAULT_DESCRIPTION,
  ...props
}) => {
  return (
    <Stack component={Card} {...props}>
      <Stack
        component={CardContent}
        direction="row"
        spacing={4}
        justifyContent="center"
        alignItems="center"
      >
        <SentimentDissatisfied color="action" sx={{ fontSize: 80 }} />
        <Stack spacing={1}>
          <Typography variant="h1" color="textSecondary">
            404
          </Typography>
          {typeof label === "string" || typeof label === "number" ? (
            <Typography variant="h4" color="textSecondary">
              {label}
            </Typography>
          ) : (
            label
          )}
          {typeof description === "string" ||
          typeof description === "number" ? (
            <Typography variant="caption" color="textSecondary">
              {description}
            </Typography>
          ) : (
            description
          )}
          <Stack direction="row">
            <BackButton variant="text" size="small" />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PageNotFoundCard;
