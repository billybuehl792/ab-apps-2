import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { Container } from "@mui/material";
import JobList, { type IJobListProps } from "@/containers/lists/JobList";
import JobCreateButton from "@/containers/buttons/JobCreateButton";
import { jobListRequestSchema } from "@/store/schemas/jobs";

const paramsSchema = jobListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/jobs/")({
  validateSearch: paramsSchema,
  search: { middlewares: [stripSearchParams(defaultParams)] },
  beforeLoad: () => ({
    crumb: null,
    pageHeaderEndContent: <JobCreateButton variant="text" />,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /* Values */

  const params = Route.useSearch();
  const navigate = Route.useNavigate();

  /** Callbacks */

  const handleOnParamsChange: IJobListProps["onParamsChange"] = (newParams) =>
    navigate({
      to: ".",
      search: newParams,
      replace: true,
    });

  return (
    <Container sx={{ pb: 2 }}>
      <JobList
        params={params}
        onParamsChange={handleOnParamsChange}
        slotProps={{
          header: {
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
          },
        }}
      />
    </Container>
  );
}
