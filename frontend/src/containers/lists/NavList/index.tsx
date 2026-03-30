import { Groups, Home } from "@mui/icons-material";
import NestedList, {
  type INestedListProps,
} from "@/components/lists/NestedList";
import useAuth from "@/store/hooks/useAuth";
import { WorkOrderIcons } from "@/store/constants/work-orders";
import { AccountIcons } from "@/store/constants/account";
import { AdminIcons } from "@/store/constants/admin";
import { PlaceIcons } from "@/store/constants/places";
import { ContactIcons } from "@/store/constants/contacts";

const NavList = (props: Partial<INestedListProps>) => {
  /** Values */

  const auth = useAuth();

  const items: IListItem[] = [
    {
      id: "home",
      value: "home",
      label: "Home",
      Icon: Home,
      link: { to: "/app/dashboard", activeOptions: { exact: true } },
    },
    {
      id: "directory",
      value: "directory",
      label: "Directory",
      Icon: Groups,
      link: { to: "/app/directory" },
      items: [
        {
          id: "contacts",
          value: "contacts",
          label: "Contacts",
          Icon: ContactIcons.List,
          link: { to: "/app/directory/contacts" },
        },
        {
          id: "places",
          value: "places",
          label: "Places",
          Icon: PlaceIcons.List,
          link: { to: "/app/directory/places" },
        },
      ],
    },
    {
      id: "workOrders",
      value: "workOrders",
      label: "Work Orders",
      Icon: WorkOrderIcons.List,
      link: { to: "/app/dashboard/work-orders" },
    },
    {
      id: "profile",
      value: "profile",
      label: "Profile",
      Icon: AccountIcons.Detail,
      link: {
        to: "/app/dashboard/profile/$id",
        params: { id: String(auth.me?.id) },
      },
    },
    {
      id: "admin",
      value: "admin",
      label: "Admin",
      Icon: AdminIcons.Detail,
      link: { to: "/app/dashboard/admin" },
    },
  ];

  return <NestedList items={items} {...props} />;
};

export default NavList;
