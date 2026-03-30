import { Groups, Home } from "@mui/icons-material";
import NestedList, {
  type INestedListProps,
} from "@/components/lists/NestedList";
import useAuth from "@/store/hooks/useAuth";
import { AccountIcons } from "@/store/constants/account";
import { PlaceIcons } from "@/store/constants/places";
import { ContactIcons } from "@/store/constants/contacts";
import { EUserGroup } from "@/store/enums/account";

const NavList = (props: Partial<INestedListProps>) => {
  /** Values */

  const auth = useAuth();

  const isAdmin = auth.me?.groups.some(
    (group) =>
      group === EUserGroup.CompanyAdmin || group === EUserGroup.AbAdmin,
  );

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
      id: "profile",
      value: "profile",
      label: "Profile",
      Icon: AccountIcons.Detail,
      link: {
        to: "/app/profile/$id",
        params: { id: String(auth.me?.id) },
      },
    },
    {
      id: "admin",
      value: "admin",
      label: "Admin",
      Icon: AccountIcons.users.Detail,
      render: isAdmin,
      link: { to: "/app/admin" },
    },
  ];

  return <NestedList items={items} {...props} />;
};

export default NavList;
