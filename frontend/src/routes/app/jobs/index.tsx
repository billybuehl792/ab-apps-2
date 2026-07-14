import type { ComponentProps } from "react";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@mui/material";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import useJob from "@/store/hooks/useJob";
import JobList from "@/containers/lists/JobList";
import JobListCard from "@/containers/lists/JobList/components/cards/JobListCard";
import JobCreateButton from "@/containers/buttons/JobCreateButton";
import { jobQueries } from "@/store/queries/jobs";
import { jobListRequestSchema } from "@/store/schemas/jobs";

const paramsSchema = jobListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/jobs/")({
  validateSearch: paramsSchema,
  search: {
    middlewares: [
      sanitizeSearchParams(paramsSchema),
      stripSearchParams(defaultParams),
    ],
  },
  component: RouteComponent,
  staticData: {
    PageHeaderEndContentComponent: () => <JobCreateButton variant="text" />,
  },
});

function RouteComponent() {
  /* Values */

  const params = Route.useSearch();
  const navigate = Route.useNavigate();

  /** Queries */

  const jobListQuery = useQuery(jobQueries.list({ params }));

  /** Callbacks */

  const handleOnParamsChange = (newParams: Partial<typeof params>) =>
    navigate({
      to: ".",
      search: (s) => ({ ...s, ...newParams }),
      replace: true,
    });

  return (
    <Container sx={{ pb: 2 }}>
      <JobList
        items={jobListQuery.data?.results ?? []}
        count={jobListQuery.data?.count ?? -1}
        page={params.page}
        pageSize={params.page_size}
        search={params.search}
        ordering={params.ordering ?? null}
        status={params.status ?? null}
        loading={jobListQuery.isLoading}
        error={jobListQuery.error}
        onPageChange={(page) => handleOnParamsChange({ page })}
        onPageSizeChange={(page_size) =>
          handleOnParamsChange({ page: 1, page_size })
        }
        onSearchChange={(search) => handleOnParamsChange({ page: 1, search })}
        onOrderingChange={(ordering) =>
          handleOnParamsChange({ page: 1, ordering: ordering ?? undefined })
        }
        onStatusChange={(status) =>
          handleOnParamsChange({ page: 1, status: status ?? undefined })
        }
        renderCard={(job) => <ListCard job={job} />}
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

const ListCard = ({ job, ...props }: ComponentProps<typeof JobListCard>) => {
  /** Values */

  const { options } = useJob(job);

  return (
    <JobListCard
      job={job}
      options={options}
      link={{ to: "/app/jobs/$id", params: { id: job.id } }}
      {...props}
    />
  );
};
