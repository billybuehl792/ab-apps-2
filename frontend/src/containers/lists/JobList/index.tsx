import { useMemo, type ComponentProps } from "react";
import { useQuery } from "@tanstack/react-query";
import { Divider, Stack, type StackProps } from "@mui/material";
import PaginatedList from "@/components/lists/PaginatedList";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import JobListCard from "./components/cards/JobListCard";
import JobCreateButton from "@/containers/buttons/JobCreateButton";
import JobListOrderingField from "./components/fields/JobListOrderingField";
import CityAutocomplete from "@/containers/fields/CityAutocomplete";
import { jobEndpoints, JobIcons } from "@/store/constants/jobs";
import { EObjectChangeType } from "@/store/enums/api";
import type { TJob, TJobListRequest } from "@/store/types/jobs";

type TCardProps = Partial<Omit<ComponentProps<typeof JobListCard>, "job">>;

export interface IJobListProps extends StackProps {
  params: TJobListRequest["params"];
  onParamsChange: (newParams: TJobListRequest["params"]) => void;
  slotProps?: {
    header?: StackProps;
    card?: TCardProps | ((job: TJob) => TCardProps);
  };
}

const JobList: React.FC<IJobListProps> = ({
  params,
  onParamsChange,
  slotProps,
  ...props
}) => {
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

  const handleOnParamsChange: IJobListProps["onParamsChange"] = (newParams) =>
    onParamsChange?.(newParams);

  const handleOnCardChange: TCardProps["onChange"] = (job, type) => {
    if (type === EObjectChangeType.Delete) {
      const isLastItemOnPage = jobListQuery.data?.results.at(-1)?.id === job.id;
      const isFirstPage = params.page === 1;
      if (isLastItemOnPage && !isFirstPage)
        handleOnParamsChange({ ...params, page: Math.max(1, params.page - 1) });
      else jobListQuery.refetch();
    }
  };

  return (
    <Stack position="relative" spacing={2} {...props}>
      <Stack {...slotProps?.header}>
        <Stack spacing={2} py={2}>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            alignItems="center"
            justifyContent="flex-start"
          >
            <DebouncedSearchField
              value={params.search}
              size="small"
              loading={!!jobListQuery.isLoading && !!params.search}
              onChange={(value) =>
                handleOnParamsChange({ ...params, page: 1, search: value })
              }
              sx={{ flex: 1 }}
            />
            <JobListOrderingField
              value={params.ordering ?? null}
              disabled={jobListQuery.isLoading}
              size="small"
              onChange={(ordering) =>
                handleOnParamsChange({
                  ...params,
                  page: 1,
                  ordering: ordering ?? undefined,
                })
              }
              sx={{ width: { xs: "100%", sm: 160 } }}
            />
          </Stack>
        </Stack>
        <Divider />
      </Stack>
      <PaginatedList
        items={jobListQuery.data?.results ?? []}
        total={total}
        page={params.page}
        pageSize={params.page_size}
        loading={jobListQuery.isLoading}
        error={jobListQuery.error}
        empty={
          total === 0 && {
            label: "No Jobs Found",
            icon: <JobIcons.List fontSize="large" />,
            ...(params.search
              ? { description: `No results for "${params.search}".` }
              : { actions: [<JobCreateButton />] }),
          }
        }
        renderItem={(job) => (
          <JobListCard
            key={job.id}
            job={job}
            onChange={handleOnCardChange}
            {...(typeof slotProps?.card === "function"
              ? slotProps.card(job)
              : slotProps?.card)}
          />
        )}
        renderSkeletonItem
        onPageChange={(page) => handleOnParamsChange({ ...params, page })}
        onPageSizeChange={(pageSize) =>
          handleOnParamsChange({ ...params, page: 1, page_size: pageSize })
        }
      />
    </Stack>
  );
};

export default JobList;
