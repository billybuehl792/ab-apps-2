import React from "react";
import { BottomNavigation, Paper, type PaperProps } from "@mui/material";
import { Home } from "@mui/icons-material";
import useAuth from "@/store/hooks/useAuth";
import BottomNavigationActionLink from "@/components/links/BottomNavigationActionLink";
import { AccountIcons } from "@/store/constants/account";
import { ContactIcons } from "@/store/constants/contacts";
import { JobIcons } from "@/store/constants/jobs";
import { EUserGroup } from "@/store/enums/account";

const Footer: React.FC<PaperProps> = (props) => {
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
      icon: <Home />,
      link: { to: "/app", activeOptions: { exact: true } },
    },
    {
      id: "jobs",
      value: "jobs",
      label: "Jobs",
      icon: <JobIcons.List />,
      link: { to: "/app/jobs" },
    },
    {
      id: "contacts",
      value: "contacts",
      label: "Contacts",
      icon: <ContactIcons.List />,
      link: { to: "/app/contacts" },
    },
    {
      id: "profile",
      value: "profile",
      label: "Profile",
      icon: <AccountIcons.Detail />,
      link: {
        to: "/app/profile/$id",
        params: { id: String(auth.me?.id) },
      },
    },
    {
      id: "admin",
      value: "admin",
      label: "Admin",
      icon: <AccountIcons.users.Detail />,
      render: isAdmin,
      link: { to: "/app/admin" },
    },
  ];

  return (
    <Paper variant="outlined" {...props}>
      <BottomNavigation showLabels>
        {items
          .filter(({ render }) => render !== false)
          .map(({ id, link, ...item }) => (
            <BottomNavigationActionLink key={id} {...item} {...link} />
          ))}
      </BottomNavigation>
    </Paper>
  );
};

export default Footer;
