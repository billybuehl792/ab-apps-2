import React from "react";
import ListCard, { type IListCardProps } from "@/components/cards/ListCard";
import GridCard, { type IGridCardProps } from "@/components/cards/GridCard";
import type { TDocument } from "@/store/types/documents";
import { CardMedia } from "@mui/material";

interface IDocumentListCardBaseProps {
  document: TDocument;
  options?: IMenuOption[];
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    document: TDocument,
    selected: boolean,
  ) => void;
}

type IDocumentListCardListProps = {
  listVariant?: "list";
} & Omit<IListCardProps, "label" | "description" | "options" | "onClick">;

type IDocumentListCardGridProps = {
  listVariant: "grid";
} & Omit<
  IGridCardProps,
  "image" | "label" | "description" | "options" | "onClick"
>;

export type IDocumentListCardProps = IDocumentListCardBaseProps &
  (IDocumentListCardListProps | IDocumentListCardGridProps);

const DocumentListCard: React.FC<IDocumentListCardProps> = ({
  document,
  options,
  listVariant,
  selected,
  onClick,
  ...props
}) => {
  if (listVariant === "grid") {
    return (
      <GridCard
        image={document.thumbnail ?? undefined}
        label={document.label}
        selected={selected}
        description={document.original_filename}
        options={options}
        {...(!!onClick && {
          onClick: (event) => onClick?.(event, document, !!selected),
        })}
        {...props}
      />
    );
  }
  return (
    <ListCard
      label={document.label}
      description={document.original_filename}
      selected={selected}
      options={options}
      startContent={
        <CardMedia
          image={document.thumbnail ?? undefined}
          sx={{ width: 48, height: 48, borderRadius: 1 }}
        />
      }
      {...(!!onClick && {
        onClick: (event) => onClick?.(event, document, !!selected),
      })}
      {...props}
    />
  );
};

export default DocumentListCard;
