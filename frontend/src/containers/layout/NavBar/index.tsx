import { AppBar, type AppBarProps, Stack, Toolbar } from "@mui/material";
import Link from "@/components/elements/Link";

interface NavBarProps extends AppBarProps {
  height: number;
}

const NavBar = ({ height, ...props }: NavBarProps) => {
  /** Values */

  const items: ListItem[] = [
    { id: "home", link: { to: "/" }, label: "Home" },
    { id: "app", link: { to: "/app" }, label: "App" },
    { id: "clients", link: { to: "/app/clients" }, label: "Clients" },
    { id: "sign-in", link: { to: "/sign-in" }, label: "Sign In" },
    { id: "sign-out", link: { to: "/sign-out" }, label: "Sign Out" },
  ];

  return (
    <AppBar variant="outlined" {...props}>
      <Toolbar sx={{ height }}>
        <Stack
          direction="row"
          flexGrow={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Link
            to="/"
            label="AB Sandbox App"
            variant="h6"
            color="primary.contrastText"
            underline="none"
            fontWeight={600}
          />
          <Stack direction="row" spacing={2}>
            {items.map((item) => (
              <Link
                key={item.id}
                label={item.label}
                {...item.link}
                color="primary.contrastText"
              />
            ))}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
