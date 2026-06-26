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
import NavListIconButton from "@/containers/buttons/NavListIconButton";

const NavBar: React.FC<AppBarProps> = (props: AppBarProps) => {
  /** Values */

  const isMobile = useMediaQuery(({ breakpoints }) => breakpoints.down("sm"));

  return (
    <AppBar {...props}>
      <Container sx={{ width: "100%", height: "100%" }}>
        <Stack
          component={Toolbar}
          direction="row"
          disableGutters
          flexGrow={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack spacing={2} direction="row" alignItems="center">
            {isMobile && <NavListIconButton />}
            <Link
              label="AB Sandbox App"
              to="/app"
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
  );
};

export default NavBar;
