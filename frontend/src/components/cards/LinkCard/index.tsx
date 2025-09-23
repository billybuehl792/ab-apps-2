import { type JSX } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import {
  Card,
  CardActionArea,
  CardContent,
  type CardProps,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowForwardIos, SvgIconComponent } from "@mui/icons-material";

interface LinkCardProps extends Omit<CardProps, "title"> {
  title: string | JSX.Element;
  subtitle?: string | JSX.Element;
  Icon?: SvgIconComponent;
  linkOptions: LinkProps;
}

const LinkCard = ({
  Icon,
  title,
  subtitle,
  linkOptions,
  ...props
}: LinkCardProps) => {
  return (
    <Card {...props}>
      <Link
        {...linkOptions}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CardActionArea>
          <Stack
            component={CardContent}
            direction="row"
            spacing={2}
            alignItems="center"
          >
            {Icon && <Icon fontSize="large" color="disabled" />}
            <Stack flexGrow={1}>
              {typeof title === "string" ? (
                <Typography variant="body1">{title}</Typography>
              ) : (
                title
              )}
              {subtitle &&
                (typeof subtitle === "string" ? (
                  <Typography variant="caption" color="text.secondary">
                    {subtitle}
                  </Typography>
                ) : (
                  subtitle
                ))}
            </Stack>
            <ArrowForwardIos fontSize="xs" />
          </Stack>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default LinkCard;
