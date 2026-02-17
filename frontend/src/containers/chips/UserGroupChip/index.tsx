import { Chip, type ChipProps } from "@mui/material";
import { EUserGroup } from "@/store/enums/account";

interface UserGroupChipProps extends ChipProps {
  group: UserGroup;
}

const UserGroupChip = ({ group, ...props }: UserGroupChipProps) => {
  /** Values */

  const color =
    group === EUserGroup.AbAdmin
      ? "success"
      : group === EUserGroup.CompanyAdmin
        ? "info"
        : "default";

  return <Chip label={group.snakeCaseToTitleCase()} color={color} {...props} />;
};

export default UserGroupChip;
