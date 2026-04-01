import React from "react";
import {
  Card,
  CardContent,
  Stack,
  type StackProps,
  Typography,
} from "@mui/material";
import { SentimentDissatisfied } from "@mui/icons-material";
import BackButton from "@/containers/buttons/BackButton";

const PageNotFoundCard: React.FC<StackProps> = (props) => {
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
          <Typography variant="h4" color="textSecondary">
            Page Not Found
          </Typography>
          <Typography variant="caption" color="textSecondary">
            The page you are looking for does not exist. Please check the URL or
            return to the homepage.
          </Typography>
          <Stack direction="row">
            <BackButton variant="text" size="small" />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PageNotFoundCard;
