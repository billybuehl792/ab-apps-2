import { type ComponentProps } from "react";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import { useNavigate } from "@tanstack/react-router";
import { Person } from "@mui/icons-material";
import type { TUser } from "@/store/types/account";

interface TUserMenuOptionIconButtonProps extends Omit<
  ComponentProps<typeof MenuOptionIconButton>,
  "options"
> {
  user: TUser | TUser["id"];
}

const UserMenuOptionIconButton: React.FC<TUserMenuOptionIconButtonProps> = ({
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
        navigate({ to: "/app/profile/$id", params: { id: String(userId) } }),
    },
  ];

  return <MenuOptionIconButton options={options} {...props} />;
};

export default UserMenuOptionIconButton;
