import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Container } from "@mui/material";
import JobList, { type IJobListProps } from "@/containers/lists/JobList";
import JobCreateButton from "@/containers/buttons/JobCreateButton";
import { jobListRequestSchema } from "@/store/schemas/jobs";

const paramsSchema = jobListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/jobs/")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
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
  const navigate = useNavigate();

  /** Callbacks */

  const handleOnParamsChange: IJobListProps["onParamsChange"] = (newParams) =>
    navigate({
      to: ".",
      search: paramsSchema.parse(newParams),
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
