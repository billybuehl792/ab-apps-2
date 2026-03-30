import { useLocation, useNavigate } from "@tanstack/react-router";
import { Avatar } from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import MenuOptionIconButton, {
  type IMenuOptionIconButtonProps,
} from "@/components/buttons/MenuOptionIconButton";
import useConfirm from "@/store/hooks/useConfirm";
import useAuth from "@/store/hooks/useAuth";
import { NULL_ID } from "@/store/constants/api";

const MeMenuOptionIconButton: React.FC<Partial<IMenuOptionIconButtonProps>> = (
  props,
) => {
  /** Values */

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const confirm = useConfirm();

  const userId = auth.me?.id ?? NULL_ID;

  const options: IMenuOption[] = [
    {
      id: "profile",
      value: "profile",
      label: "Profile",
      icon: <Person />,
      disabled: userId === NULL_ID,
      selected: location.pathname.startsWith("/app/profile"),
      link: {
        to: "/app/profile/$id",
        params: { id: String(userId) },
      },
    },
    {
      id: "signOut",
      value: "signOut",
      label: "Sign Out",
      icon: <Logout />,
      color: "error",
      onClick: () => confirm("Sign Out", () => navigate({ to: "/sign-out" })),
    },
  ];

  return (
    <MenuOptionIconButton options={options} icon={<Avatar />} {...props} />
  );
};

export default MeMenuOptionIconButton;
