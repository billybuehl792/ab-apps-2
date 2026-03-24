import { Chip, type ChipProps } from "@mui/material";
import { EUserGroup } from "@/store/enums/account";

interface IUserGroupChipProps extends ChipProps {
  group: EUserGroup;
}

const UserGroupChip = ({ group, ...props }: IUserGroupChipProps) => {
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
