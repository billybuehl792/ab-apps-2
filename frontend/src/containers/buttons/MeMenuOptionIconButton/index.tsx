import { type ComponentProps } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Avatar } from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import useConfirm from "@/store/hooks/useConfirm";
import useAuth from "@/store/hooks/useAuth";

type MeMenuOptionIconButtonProps = Omit<
  ComponentProps<typeof MenuOptionIconButton>,
  "options"
>;

const MeMenuOptionIconButton = (props: MeMenuOptionIconButtonProps) => {
  /** Values */

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const confirm = useConfirm();

  const options: MenuOption[] = [
    {
      id: "profile",
      label: "Profile",
      icon: <Person />,
      selected: location.pathname.startsWith("/app/profile"),
      onClick: () =>
        navigate({
          to: "/app/profile/$id",
          params: { id: String(auth.me?.id ?? 0) },
        }),
    },
    {
      id: "signOut",
      label: "Sign Out",
      icon: <Logout />,
      color: "error",
      onClick: () => confirm("Sign Out", () => navigate({ to: "/sign-out" })),
    },
  ];

  return (
    <MenuOptionIconButton options={options} {...props}>
      <Avatar />
    </MenuOptionIconButton>
  );
};

export default MeMenuOptionIconButton;
