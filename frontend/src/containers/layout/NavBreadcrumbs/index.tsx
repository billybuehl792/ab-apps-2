import { useMatches } from "@tanstack/react-router";
import { Breadcrumbs, type BreadcrumbsProps } from "@mui/material";
import CustomLink from "@/components/links/CustomLink";

const NavBreadcrumbs = (props: BreadcrumbsProps) => {
  /** Values */

  const matches = useMatches();

  /** Callbacks */

  return (
    <>
      <Breadcrumbs {...props}>
        {matches.map(
          (match) =>
            !!match.loaderData?.crumb && (
              <CustomLink
                key={match.id}
                label={match.loaderData.crumb.label}
                Icon={match.loaderData.crumb.Icon}
                to={match.pathname}
                activeOptions={{ exact: true, includeSearch: false }}
                color="text.secondary"
                sx={{
                  "&[data-status='active']": {
                    color: "text.primary",
                    fontWeight: "bold",
                    pointerEvents: "none",
                    cursor: "default",
                  },
                }}
              />
            )
        )}
      </Breadcrumbs>
    </>
  );
};

export default NavBreadcrumbs;
