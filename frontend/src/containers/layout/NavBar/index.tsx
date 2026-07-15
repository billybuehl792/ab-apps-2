import {
  AppBar,
  type AppBarProps,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import Link from "@/components/links/CustomLink";
import MeMenuOptionIconButton from "@/containers/buttons/MeMenuOptionIconButton";
import NavListIconButton from "@/containers/buttons/NavListIconButton";

const NavBar: React.FC<AppBarProps> = (props) => {
  /** Values */

  const isMobile = useMediaQuery(({ breakpoints }) => breakpoints.down("sm"));

  return (
    <AppBar {...props}>
      <Toolbar>
        {isMobile && <NavListIconButton sx={{ mr: 1 }} />}
        <Link
          label="AB Sandbox App"
          to="/app"
          variant="h6"
          color="primary.contrastText"
          underline="none"
          fontWeight={600}
          noWrap
        />
        <MeMenuOptionIconButton color="inherit" sx={{ ml: "auto" }} />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
