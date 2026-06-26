import React, { type ComponentProps, useMemo, type ReactNode } from "react";
import {
  Card,
  type CardActionAreaProps,
  CardContent,
  Stack,
  type CardProps,
  Typography,
  CardActionArea,
  CardActions,
  type CardMediaProps,
  CardMedia,
  type CardHeaderProps,
  CardHeader,
  type StackProps,
  type TypographyProps,
  type SvgIconProps,
} from "@mui/material";
import { type LinkOptions } from "@tanstack/react-router";
import CardActionAreaLink from "@/components/links/CardActionAreaLink";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import { sxUtils } from "@/store/utils/sx";

interface IGridCardBaseProps {
  image?: string;
  headerContent?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
}

export interface IGridCardProps
  extends Omit<StackProps<typeof Card>, "onClick">, IGridCardBaseProps {
  link?: LinkOptions | false;
  options?: IMenuOption[];
  disabled?: boolean;
  selected?: boolean;
  onClick?: CardActionAreaProps["onClick"];
  slotProps?: {
    root?: Partial<CardProps>;
    cardHeader?: Partial<CardHeaderProps>;
    cardMedia?: Partial<CardMediaProps>;
    cardContent?: Partial<IGridCardContentProps>;
    cardActions?: Partial<IGridCardActionsProps>;
  };
}

interface IGridCardContentProps
  extends StackProps<typeof CardContent>, IGridCardBaseProps {
  slotProps?: {
    icon?: Partial<SvgIconProps>;
    title?: TypographyProps;
    description?: TypographyProps;
  };
}

interface IGridCardActionsProps extends StackProps<typeof CardActions> {
  options?: IGridCardProps["options"];
  disabled?: boolean;
  slotProps?: {
    optionsIconButton?: Partial<ComponentProps<typeof MenuOptionIconButton>>;
  };
}

const CARD_CONTENT_HEIGHT = 48;
const CARD_ACTIONS_WIDTH = 32;

const GridCard: React.FC<IGridCardProps> = ({
  image,
  headerContent,
  label,
  description,
  link,
  disabled,
  selected,
  options,
  slotProps,
  onClick,
  ...props
}) => {
  /** Values */

  const Content = useMemo(
    () => (
      <>
        {headerContent && (
          <CardHeader
            title={headerContent}
            {...slotProps?.cardHeader}
            sx={[
              { pt: 1, pb: 0 },
              ...sxUtils.asArray(slotProps?.cardHeader?.sx),
            ]}
          />
        )}
        {image && (
          <CardMedia
            component="img"
            height="200"
            image={image}
            alt={typeof label === "string" ? label : "Card image"}
            {...slotProps?.cardMedia}
          />
        )}
        <GridCardContent
          label={label}
          description={description}
          {...slotProps?.cardContent}
        />
      </>
    ),
    [
      label,
      image,
      headerContent,
      description,
      slotProps?.cardContent,
      slotProps?.cardHeader,
      slotProps?.cardMedia,
    ],
  );

  return (
    <Stack
      component={Card}
      position="relative"
      data-selected={selected}
      data-disabled={disabled}
      {...props}
    >
      {link ? (
        <CardActionAreaLink {...link} disabled={disabled} onClick={onClick}>
          {Content}
        </CardActionAreaLink>
      ) : onClick ? (
        <CardActionArea disabled={disabled} onClick={onClick}>
          {Content}
        </CardActionArea>
      ) : (
        Content
      )}
      {!!options?.length && (
        <GridCardActions
          options={options}
          disabled={disabled}
          {...slotProps?.cardActions}
        />
      )}
    </Stack>
  );
};

const GridCardContent: React.FC<IGridCardContentProps> = ({
  label,
  description,
  slotProps,
  ...props
}) => {
  return (
    <CardContent
      component={Stack}
      spacing={0.5}
      {...props}
      sx={[
        {
          height: CARD_CONTENT_HEIGHT,
          justifyContent: "center",
          pr: CARD_ACTIONS_WIDTH / 4,
        },
        ...sxUtils.asArray(props.sx),
      ]}
    >
      {!!label && (
        <GridCardContentElement
          value={label}
          variant="body1"
          noWrap
          {...slotProps?.title}
        />
      )}
      {!!description && (
        <GridCardContentElement
          value={description}
          variant="caption"
          noWrap
          {...slotProps?.description}
        />
      )}
    </CardContent>
  );
};

const GridCardActions: React.FC<IGridCardActionsProps> = ({
  options,
  disabled,
  slotProps,
  ...props
}) => {
  return (
    <Stack
      component={CardActions}
      direction="row"
      {...props}
      sx={[
        {
          position: "absolute",
          height: CARD_CONTENT_HEIGHT,
          width: CARD_ACTIONS_WIDTH,
          bottom: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        },
        ...sxUtils.asArray(props.sx),
      ]}
    >
      {!!options?.length && (
        <MenuOptionIconButton
          options={options}
          disabled={disabled}
          {...slotProps?.optionsIconButton}
          sx={[
            { pointerEvents: "auto" },
            ...sxUtils.asArray(slotProps?.optionsIconButton?.sx),
          ]}
        />
      )}
    </Stack>
  );
};

const GridCardContentElement: React.FC<
  Omit<TypographyProps, "children"> & { value: ReactNode }
> = ({ value, ...props }) => {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number")
    return <Typography {...props}>{value}</Typography>;
  return value;
};

export default GridCard;
