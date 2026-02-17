import { type ComponentProps } from "react";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import { useNavigate } from "@tanstack/react-router";
import { Person } from "@mui/icons-material";
import type { IUser } from "@/store/types/account";

interface IUserMenuOptionIconButtonProps extends Omit<
  ComponentProps<typeof MenuOptionIconButton>,
  "options"
> {
  user: IUser | IUser["id"];
}

const UserMenuOptionIconButton: React.FC<IUserMenuOptionIconButtonProps> = ({
  user,
  ...props
}) => {
  /** Values */

  const navigate = useNavigate();

  const userId = typeof user === "object" ? user.id : user;

  const options: IMenuOption[] = [
    {
      id: "profile",
      value: "profile",
      label: "Profile",
      icon: <Person />,
      onClick: () =>
        navigate({
          to: "/app/dashboard/profile/$id",
          params: { id: String(userId) },
        }),
    },
  ];

  return <MenuOptionIconButton options={options} {...props} />;
};

export default UserMenuOptionIconButton;
