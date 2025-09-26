import { type ComponentProps } from "react";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import type { User } from "@/store/types/account";
import { useNavigate } from "@tanstack/react-router";
import { Person } from "@mui/icons-material";

interface UserMenuOptionIconButtonProps
  extends Omit<ComponentProps<typeof MenuOptionIconButton>, "options"> {
  user: User | User["id"];
}

const UserMenuOptionIconButton = ({
  user,
  ...props
}: UserMenuOptionIconButtonProps) => {
  /** Values */

  const navigate = useNavigate();

  const userId = typeof user === "object" ? user.id : user;

  const options: MenuOption[] = [
    {
      id: "profile",
      label: "Profile",
      Icon: Person,
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
