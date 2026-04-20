import React, { type ComponentProps } from "react";
import ButtonLink from "@/components/links/ButtonLink";
import { Add } from "@mui/icons-material";

type TJobCreateButtonProps = Omit<ComponentProps<typeof ButtonLink>, "to">;

const JobCreateButton: React.FC<TJobCreateButtonProps> = (props) => {
  return (
    <ButtonLink to="/app/board/jobs/create" startIcon={<Add />} {...props}>
      Create
    </ButtonLink>
  );
};

export default JobCreateButton;
