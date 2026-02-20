import React, { type ComponentProps } from "react";
import {
  Card,
  CardContent,
  type CardProps,
  Stack,
  Typography,
} from "@mui/material";
import { Home, SentimentDissatisfied } from "@mui/icons-material";
import ButtonLink from "@/components/links/ButtonLink";

interface IPageNotFoundCardProps extends CardProps<typeof Card> {
  link?: ComponentProps<typeof ButtonLink> | false;
}

const PageNotFoundCard: React.FC<IPageNotFoundCardProps> = ({
  link = { children: "Home", startIcon: <Home />, to: "/app/dashboard" },
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
          <Typography variant="h4" color="textSecondary">
            Page Not Found
          </Typography>
          <Typography variant="caption" color="textSecondary">
            The page you are looking for does not exist. Please check the URL or
            return to the homepage.
          </Typography>
          {!!link && (
            <Stack direction="row">
              <ButtonLink variant="text" size="small" {...link} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PageNotFoundCard;
