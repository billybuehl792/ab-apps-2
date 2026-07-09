import {
  createFileRoute,
  Outlet,
  redirect,
  useMatches,
} from "@tanstack/react-router";
import { Box, Container, Paper, Stack, useMediaQuery } from "@mui/material";
import { Home } from "@mui/icons-material";
import NavBar from "@/containers/layout/NavBar";
import NavList from "@/containers/lists/NavList";
import NavBreadcrumbs from "@/containers/layout/NavBreadcrumbs";
import Footer from "@/containers/layout/Footer";
import FullScreen from "@/components/layout/FullScreen";
import StatusWrapper from "@/components/layout/StatusWrapper";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import Breadcrumb from "@/components/links/Breadcrumb";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ context, location }) => {
    const isAuthenticated = !!context.auth.me;
    if (!isAuthenticated)
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
        replace: true,
      });

    return {
      crumb: { label: "Home", Icon: Home, pathname: location.pathname },
    };
  },
  component: RouteComponent,
  pendingComponent: () => (
    <FullScreen>
      <StatusWrapper
        loading={{
          label: "Loading...",
          description: "Initializing the application...",
        }}
      />
    </FullScreen>
  ),
  notFoundComponent: () => (
    <Container>
      <PageNotFoundCard my={2} />
    </Container>
  ),
  staticData: {
    crumb: {
      id: "contacts",
      Component: () => (
        <Breadcrumb to="/app" children="Home" startIcon={<Home />} />
      ),
    },
  },
});

function RouteComponent() {
  /** Values */

  const isDesktop = useMediaQuery(({ breakpoints }) => breakpoints.up("sm"));

  const currentPageHeaderEndContent = useMatches({
    select: (matches) =>
      matches.findLast((m) => !!m.staticData?.PageHeaderEndContentComponent),
  });

  return (
    <>
      <NavBar />
      {isDesktop && (
        <Paper
          component="nav"
          variant="outlined"
          square
          sx={({ layout, zIndex }) => ({
            position: "fixed",
            overflowY: "auto",
            zIndex: zIndex.drawer,
            top: layout.nav.height,
            left: 0,
            bottom: 0,
            width: layout.nav.panelWidth,
          })}
        >
          <NavList />
        </Paper>
      )}
      <Box
        component="main"
        sx={(theme) => ({
          position: "absolute",
          top: theme.layout.nav.height,
          bottom: isDesktop ? 0 : theme.layout.footer.height,
          left: isDesktop ? theme.layout.nav.panelWidth : 0,
          width: isDesktop
            ? `calc(100% - ${theme.layout.nav.panelWidth}px)`
            : "100%",
          height: `calc(100% - ${theme.layout.nav.height}px - ${isDesktop ? 0 : theme.layout.footer.height}px)`,
        })}
      >
        <Container
          sx={(theme) => ({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: theme.layout.page.header.height,
          })}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={(theme) => ({
              justifyContent: "space-between",
              alignItems: "center",
              height: theme.layout.page.header.height,
              boxSizing: "border-box",
              bgcolor: "background.paper",
              borderBottom: `1px solid ${theme.palette.divider}`,
            })}
          >
            <NavBreadcrumbs />
            {!!currentPageHeaderEndContent?.staticData
              ?.PageHeaderEndContentComponent && (
              <currentPageHeaderEndContent.staticData.PageHeaderEndContentComponent />
            )}
          </Stack>
        </Container>
        <Box
          sx={(theme) => ({
            position: "relative",
            top: theme.layout.page.header.height,
            bottom: 0,
            left: 0,
            right: 0,
            height: `calc(100% - ${theme.layout.page.header.height}px)`,
            overflow: "auto",
          })}
        >
          <Outlet />
        </Box>
      </Box>
      {!isDesktop && (
        <Footer
          sx={(theme) => ({
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: theme.layout.footer.height,
          })}
        />
      )}
    </>
  );
}
