import React, { type ComponentProps } from "react";
import ButtonLink from "@/components/links/ButtonLink";
import { Add } from "@mui/icons-material";

type TJobCreateRequestButtonProps = Omit<
  ComponentProps<typeof ButtonLink>,
  "to"
>;

const JobCreateButton: React.FC<TJobCreateRequestButtonProps> = (props) => {
  return (
    <ButtonLink to="/app/jobs/create" startIcon={<Add />} {...props}>
      Create
    </ButtonLink>
  );
};

export default JobCreateButton;
