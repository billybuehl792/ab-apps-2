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
  type StackProps,
  type TypographyProps,
  type SvgIconProps,
} from "@mui/material";
import { type LinkOptions } from "@tanstack/react-router";
import CardActionAreaLink from "@/components/links/CardActionAreaLink";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import { sxUtils } from "@/store/utils/sx";

interface IListCardBaseProps {
  startContent?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  endContent?: ReactNode;
}

export interface IListCardProps
  extends Omit<StackProps<typeof Card>, "onClick">, IListCardBaseProps {
  link?: LinkOptions | false;
  options?: IMenuOption[];
  disabled?: boolean;
  selected?: boolean;
  onClick?: CardActionAreaProps["onClick"];
  slotProps?: {
    root?: Partial<CardProps>;
    cardContent?: Partial<IListCardContentProps>;
    cardActions?: Partial<IListCardActionsProps>;
  };
}

interface IListCardContentProps
  extends StackProps<typeof CardContent>, IListCardBaseProps {
  slotProps?: {
    icon?: Partial<SvgIconProps>;
    startContent?: StackProps;
    mainContent?: StackProps;
    label?: TypographyProps;
    description?: TypographyProps;
    endContent?: StackProps;
  };
}

interface IListCardActionsProps extends StackProps<typeof CardActions> {
  options?: IListCardProps["options"];
  disabled?: boolean;
  slotProps?: {
    optionsIconButton?: Partial<ComponentProps<typeof MenuOptionIconButton>>;
  };
}

const ListCard: React.FC<IListCardProps> = ({
  startContent,
  label,
  description,
  endContent,
  link,
  disabled,
  selected,
  options,
  slotProps,
  onClick,
  ...props
}) => {
  /** Values */

  const actionsWidth = useMemo(
    () => (options?.length ? "72px" : undefined),
    [options?.length],
  );

  const Content = useMemo(
    () => (
      <ListCardContent
        startContent={startContent}
        label={label}
        description={description}
        endContent={endContent}
        flexGrow={1}
        mr={actionsWidth}
        {...slotProps?.cardContent}
      />
    ),
    [
      startContent,
      label,
      description,
      endContent,
      actionsWidth,
      slotProps?.cardContent,
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
        <ListCardActions
          options={options}
          disabled={disabled}
          width={actionsWidth}
          {...slotProps?.cardActions}
        />
      )}
    </Stack>
  );
};

const ListCardContent: React.FC<IListCardContentProps> = ({
  startContent,
  label,
  description,
  endContent,
  slotProps,
  ...props
}) => {
  return (
    <CardContent
      component={Stack}
      direction="row"
      spacing={2}
      alignItems="center"
      overflow="hidden"
      {...props}
    >
      {!!startContent && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          {...slotProps?.startContent}
        >
          <ListCardContentElement value={startContent} />
        </Stack>
      )}
      <Stack overflow="hidden" {...slotProps?.mainContent}>
        <ListCardContentElement value={label} noWrap {...slotProps?.label} />
        <ListCardContentElement
          value={description}
          variant="caption"
          noWrap
          {...slotProps?.description}
        />
      </Stack>
      {!!endContent && (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="end"
          alignItems="center"
          {...slotProps?.endContent}
        >
          <ListCardContentElement value={endContent} />
        </Stack>
      )}
    </CardContent>
  );
};

const ListCardActions: React.FC<IListCardActionsProps> = ({
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
      bottom={0}
      p={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      {...props}
      sx={[{ pointerEvents: "none" }, ...sxUtils.asArray(props.sx)]}
    >
      {!!options?.length && (
        <MenuOptionIconButton
          options={options}
          size="large"
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

const ListCardContentElement: React.FC<
  Omit<TypographyProps, "children"> & { value: ReactNode }
> = ({ value, ...props }) => {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number")
    return (
      <Typography noWrap {...props}>
        {value}
      </Typography>
    );
  return value;
};

export default ListCard;
