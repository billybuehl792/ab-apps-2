import { type ComponentProps } from "react";
import { Home } from "@mui/icons-material";
import NestedList from "@/components/lists/NestedList";
import useAuth from "@/store/hooks/useAuth";
import { ClientIcons } from "@/store/constants/clients";
import { WorkOrderIcons } from "@/store/constants/work-orders";
import { AccountIcons } from "@/store/constants/account";
import { AdminIcons } from "@/store/constants/admin";

const NavList = (props: Partial<ComponentProps<typeof NestedList>>) => {
  /** Values */

  const auth = useAuth();

  const items: ListItem[] = [
    {
      id: "home",
      value: "home",
      label: "Home",
      icon: <Home />,
      link: { to: "/app/dashboard", activeOptions: { exact: true } },
    },
    {
      id: "clients",
      value: "clients",
      label: "Clients",
      icon: <ClientIcons.List />,
      link: { to: "/app/dashboard/clients" },
    },
    {
      id: "workOrders",
      value: "workOrders",
      label: "Work Orders",
      icon: <WorkOrderIcons.List />,
      link: { to: "/app/dashboard/work-orders" },
    },
    {
      id: "profile",
      value: "profile",
      label: "Profile",
      icon: <AccountIcons.Detail />,
      link: {
        to: "/app/dashboard/profile/$id",
        params: { id: String(auth.me?.id) },
      },
    },
    {
      id: "admin",
      value: "admin",
      label: "Admin",
      icon: <AdminIcons.Detail />,
      link: { to: "/app/dashboard/admin" },
    },
  ];

  return <NestedList items={items} {...props} />;
};

export default NavList;
