import { useMatches } from "@tanstack/react-router";
import { Breadcrumbs, type BreadcrumbsProps } from "@mui/material";
import ButtonLink from "@/components/links/ButtonLink";

const NavBreadcrumbs = (props: BreadcrumbsProps) => {
  /** Values */

  const matches = useMatches();

  return (
    <Breadcrumbs maxItems={2} {...props}>
      {matches.map(
        (match) =>
          !!match.loaderData?.crumb && (
            <ButtonLink
              key={match.id}
              variant="text"
              size="small"
              children={match.loaderData.crumb.label}
              to={match.pathname}
              activeOptions={{ exact: true, includeSearch: false }}
              {...(match.loaderData.crumb.Icon && {
                startIcon: <match.loaderData.crumb.Icon />,
              })}
              sx={{
                color: "text.secondary",
                "&[data-status='active']": {
                  color: "text.primary",
                  pointerEvents: "none",
                  cursor: "default",
                },
              }}
            />
          ),
      )}
    </Breadcrumbs>
  );
};

export default NavBreadcrumbs;
