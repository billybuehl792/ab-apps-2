import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  AppBar,
  type AppBarProps,
  Container,
  IconButton,
  Stack,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { Menu, MenuOpen } from "@mui/icons-material";
import Link from "@/components/links/CustomLink";
import MeMenuOptionIconButton from "@/containers/buttons/MeMenuOptionIconButton";
import Drawer from "@/components/modals/Drawer";
import NavList from "@/containers/lists/NavList";

const NavBar: React.FC<AppBarProps> = (props: AppBarProps) => {
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
      <AppBar variant="outlined" {...props}>
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
                <IconButton color="inherit" onClick={handleToggleNavDrawerOpen}>
                  {open ? <MenuOpen /> : <Menu />}
                </IconButton>
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
            <MeMenuOptionIconButton color="inherit" />
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
