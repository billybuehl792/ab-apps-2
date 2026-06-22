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
  footerContent?: ReactNode;
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

const GridCard: React.FC<IGridCardProps> = ({
  image,
  headerContent,
  label,
  description,
  footerContent,
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
      <GridCardContent
        label={label}
        description={description}
        {...slotProps?.cardContent}
      />
    ),
    [label, description, slotProps?.cardContent],
  );

  return (
    <Stack
      component={Card}
      position="relative"
      data-selected={selected}
      data-disabled={disabled}
      {...props}
    >
      {image && (
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={typeof label === "string" ? label : "Card image"}
          {...slotProps?.cardMedia}
        />
      )}
      {headerContent && (
        <CardHeader
          title={headerContent}
          {...slotProps?.cardHeader}
          sx={[{ pt: 1, pb: 0 }, ...sxUtils.asArray(slotProps?.cardHeader?.sx)]}
        />
      )}
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
      {footerContent && (
        <Stack component={CardContent} spacing={1} sx={{ pt: 0 }}>
          {footerContent}
        </Stack>
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
    <CardContent component={Stack} spacing={1} {...props}>
      {!!label && (
        <GridCardContentElement
          value={label}
          variant="subtitle1"
          fontWeight={600}
          {...slotProps?.title}
        />
      )}
      {!!description && (
        <GridCardContentElement
          value={description}
          variant="body2"
          color="text.secondary"
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
      position="absolute"
      top={0}
      right={0}
      p={1}
      direction="row"
      alignItems="center"
      justifyContent="center"
      {...props}
      sx={[{ pointerEvents: "none" }, ...sxUtils.asArray(props.sx)]}
    >
      {!!options?.length && (
        <MenuOptionIconButton
          options={options}
          size="medium"
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
