import React from "react";
import ListCard, { type IListCardProps } from "@/components/cards/ListCard";
import GridCard, { type IGridCardProps } from "@/components/cards/GridCard";
import type { TDocument } from "@/store/types/documents";
import { CardMedia } from "@mui/material";

interface IDocumentListCardBaseProps {
  document: TDocument;
  options?: IMenuOption[];
  onClick?: (document: TDocument) => void;
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
  onClick,
  ...props
}) => {
  if (listVariant === "grid") {
    return (
      <GridCard
        image={document.thumbnail ?? undefined}
        label={document.label}
        description={document.original_filename}
        options={options}
        onClick={() => onClick?.(document)}
        {...props}
      />
    );
  }
  return (
    <ListCard
      label={document.label}
      description={document.original_filename}
      options={options}
      startContent={
        <CardMedia
          image={document.thumbnail ?? undefined}
          sx={{ width: 48, height: 48, borderRadius: 1 }}
        />
      }
      onClick={() => onClick?.(document)}
      {...props}
    />
  );
};

export default DocumentListCard;
