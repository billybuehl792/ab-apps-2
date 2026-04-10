import React, { type ComponentProps } from "react";
import ButtonLink from "@/components/links/ButtonLink";
import { Add } from "@mui/icons-material";

type TContactCreateButtonProps = Omit<ComponentProps<typeof ButtonLink>, "to">;

const ContactCreateButton: React.FC<TContactCreateButtonProps> = (props) => {
  return (
    <ButtonLink
      to="/app/directory/contacts/create"
      startIcon={<Add />}
      {...props}
    >
      Create
    </ButtonLink>
  );
};

export default ContactCreateButton;
