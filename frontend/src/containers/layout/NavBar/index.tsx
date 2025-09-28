import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  AppBar,
  type AppBarProps,
  Container,
  Stack,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import Link from "@/components/links/CustomLink";
import MeMenuOptionIconButton from "@/containers/buttons/MeMenuOptionIconButton";
import MenuIconButton from "@/components/buttons/MenuIconButton";
import Drawer from "@/components/modals/Drawer";
import NavList from "@/containers/lists/NavList";

interface NavBarProps extends AppBarProps {
  height: number;
}

const NavBar = ({ height, ...props }: NavBarProps) => {
  const [open, setOpen] = useState(false);

  /** Values */

  const location = useLocation();
  const isMobile = useMediaQuery(({ breakpoints }) => breakpoints.down("sm"));

  /** Callbacks */

  const handleToggleNavDrawerOpen = () => setOpen(!open);

  /** Effects */

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, isMobile]);

  return (
    <>
      <AppBar variant="outlined" sx={{ height }} {...props}>
        <Container maxWidth="lg" sx={{ width: "100%", height: "100%" }}>
          <Stack
            component={Toolbar}
            direction="row"
            disableGutters
            flexGrow={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack spacing={2} direction="row" alignItems="center">
              {isMobile && (
                <MenuIconButton
                  open={open}
                  color="inherit"
                  onClick={handleToggleNavDrawerOpen}
                />
              )}
              <Link
                label="AB Sandbox App"
                to="/app/dashboard"
                variant="h6"
                color="primary.contrastText"
                underline="none"
                fontWeight={600}
                noWrap
              />
            </Stack>
            <MeMenuOptionIconButton />
          </Stack>
        </Container>
      </AppBar>

      {/* Modals */}
      <Drawer
        title="AB Apps"
        anchor="left"
        fullHeight
        open={open}
        onClose={handleToggleNavDrawerOpen}
      >
        <NavList />
      </Drawer>
    </>
  );
};

export default NavBar;
