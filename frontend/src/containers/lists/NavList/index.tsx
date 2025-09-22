import { type ComponentProps } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  AdminPanelSettings,
  Groups,
  Home,
  Person,
  Work,
} from "@mui/icons-material";
import NestedList from "@/components/lists/NestedList";
import useAuth from "@/store/hooks/useAuth";

const NavList = (props: Partial<ComponentProps<typeof NestedList>>) => {
  /** Values */

  const auth = useAuth();
  const location = useLocation();

  const items: ListItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home />,
      selected: location.pathname === "/app",
      link: { to: "/app" },
    },
    {
      id: "clients",
      label: "Clients",
      icon: <Groups />,
      selected: location.pathname.startsWith("/app/clients"),
      link: { to: "/app/clients" },
    },
    {
      id: "workOrders",
      label: "Work Orders",
      icon: <Work />,
      selected: location.pathname.startsWith("/app/work-orders"),
      link: { to: "/app/work-orders" },
    },
    {
      id: "profile",
      label: "Profile",
      icon: <Person />,
      selected: location.pathname.startsWith("/app/profile"),
      link: {
        to: "/app/profile/$id",
        params: { id: String(auth.me?.id) },
      },
    },
    {
      id: "admin",
      label: "Admin",
      icon: <AdminPanelSettings />,
      selected: location.pathname.startsWith("/app/admin"),
      link: { to: "/app/admin" },
    },
  ];

  return <NestedList items={items} {...props} />;
};

export default NavList;
