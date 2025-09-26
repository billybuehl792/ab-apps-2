import { type ComponentProps } from "react";
import { Home } from "@mui/icons-material";
import NestedList from "@/components/lists/NestedList";
import useAuth from "@/store/hooks/useAuth";
import { CLIENTS_ICON } from "@/store/constants/clients";
import { WORK_ORDERS_ICON } from "@/store/constants/work-orders";
import { ACCOUNT_ICON } from "@/store/constants/account";
import { ADMIN_ICON } from "@/store/constants/admin";

const NavList = (props: Partial<ComponentProps<typeof NestedList>>) => {
  /** Values */

  const auth = useAuth();

  const items: ListItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      Icon: Home,
      link: { to: "/app/dashboard", activeOptions: { exact: true } },
    },
    {
      id: "clients",
      label: "Clients",
      Icon: CLIENTS_ICON,
      link: { to: "/app/dashboard/clients" },
    },
    {
      id: "workOrders",
      label: "Work Orders",
      Icon: WORK_ORDERS_ICON,
      link: { to: "/app/dashboard/work-orders" },
    },
    {
      id: "profile",
      label: "Profile",
      Icon: ACCOUNT_ICON,
      link: {
        to: "/app/dashboard/profile/$id",
        params: { id: String(auth.me?.id) },
      },
    },
    {
      id: "admin",
      label: "Admin",
      Icon: ADMIN_ICON,
      link: { to: "/app/dashboard/admin" },
    },
  ];

  return <NestedList items={items} {...props} />;
};

export default NavList;
