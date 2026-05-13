import React, { type ComponentProps } from "react";
import ButtonLink from "@/components/links/ButtonLink";
import { Add } from "@mui/icons-material";

type TPlaceCreateButtonProps = Omit<ComponentProps<typeof ButtonLink>, "to">;

const PlaceCreateButton: React.FC<TPlaceCreateButtonProps> = (props) => {
  return (
    <ButtonLink
      to="/app/directory/places/create"
      startIcon={<Add />}
      {...props}
    >
      Create
    </ButtonLink>
  );
};

export default PlaceCreateButton;
