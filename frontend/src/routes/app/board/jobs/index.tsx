import { useMemo } from "react";
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import JobList, { type IJobListProps } from "@/containers/lists/JobList";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { jobEndpoints } from "@/store/constants/jobs";
import { jobListRequestSchema } from "@/store/schemas/jobs";
import { EObjectChangeType } from "@/store/enums/api";
import type { TRouteLoaderData } from "@/store/types/router";
import JobCreateButton from "@/containers/buttons/JobCreateButton";

const paramsSchema = jobListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/board/jobs/")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  pendingComponent: () => <StatusWrapper loading my={2} />,
  errorComponent: ({ error }) => <StatusWrapper error={error} my={2} />,
  component: RouteComponent,
  loader: (): TRouteLoaderData => ({
    slotProps: {
      pageHeader: { endContent: <JobCreateButton variant="text" /> },
    },
  }),
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Queries */

  const jobListQuery = useQuery({
    queryKey: [jobEndpoints.id, { params }],
    queryFn: () => jobEndpoints.get({ params }),
  });

  /** Data */

  const total = useMemo(
    () => jobListQuery.data?.count ?? false,
    [jobListQuery.data],
  );

  /** Callbacks */

  const handleOnParamsChange = (
    newParams: z.input<typeof jobListRequestSchema.shape.params>,
  ) =>
    navigate({
      to: ".",
      search: jobListRequestSchema.shape.params.parse({
        ...params,
        ...newParams,
      }),
      replace: true,
    });

  const handleOnCardChange: IJobListProps["onCardChange"] = (job, type) => {
    if (type === EObjectChangeType.Delete) {
      const isLastItemOnPage = jobListQuery.data?.results.at(-1)?.id === job.id;
      const isFirstPage = params.page === 1;
      if (isLastItemOnPage && !isFirstPage)
        handleOnParamsChange({ page: params.page - 1 });
      else jobListQuery.refetch();
    }
  };

  return (
    <JobList
      items={jobListQuery.data?.results ?? []}
      total={total}
      options={{ params }}
      loading={jobListQuery.isLoading}
      error={jobListQuery.error}
      renderSkeletonItem
      mb={2}
      onCardChange={handleOnCardChange}
      onPageChange={(_event, page) => handleOnParamsChange({ page })}
      onSearchChange={(value) =>
        handleOnParamsChange({ search: value, page: 1 })
      }
      onOrderingChange={(value) =>
        handleOnParamsChange({ ordering: value, page: 1 })
      }
      // onFiltersChange={(value) =>
      //   handleOnParamsChange({
      //     city: value.city,
      //     tag: value.tag,
      //   })
      // }
      slotProps={{
        header: {
          position: "sticky",
          top: (theme) => theme.layout.page.header.height,
          bgcolor: "background.paper",
          zIndex: 1,
        },
      }}
    />
  );
}
