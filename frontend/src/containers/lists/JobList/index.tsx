import { type ComponentProps } from "react";
import { Stack } from "@mui/material";
import PaginatedList, {
  type IPaginatedListProps,
} from "@/components/lists/PaginatedList";
import JobListCard from "./components/cards/JobListCard";
import JobCreateButton from "@/containers/buttons/JobCreateButton";
import JobListOrderingButtonGroup, {
  type IJobListOrderingButtonGroupProps,
} from "./components/buttons/JobListOrderingButtonGroup";
import JobListFiltersIconButton, {
  type IJobListFiltersIconButtonProps,
} from "./components/buttons/JobListFiltersIconButton";
import { JobIcons } from "@/store/constants/jobs";
import type { TJob, TJobListRequest } from "@/store/types/jobs";

type TPaginatedListProps = IPaginatedListProps<TJob, TJobListRequest["params"]>;
type TCardProps = Partial<Omit<ComponentProps<typeof JobListCard>, "job">>;

export interface IJobListProps extends Omit<
  TPaginatedListProps,
  "params" | "renderItem" | "onChange" | "slotProps"
> {
  options: TJobListRequest;
  onOrderingChange?: IJobListOrderingButtonGroupProps["onChange"];
  onFiltersChange?: IJobListFiltersIconButtonProps["form"]["onSubmit"];
  onCardChange?: TCardProps["onChange"];
  slotProps?: {
    card?: TCardProps | ((job: TJob) => TCardProps);
    orderingButtonGroup?: Partial<IJobListOrderingButtonGroupProps>;
    filtersIconButton?: Partial<IJobListFiltersIconButtonProps>;
  } & TPaginatedListProps["slotProps"];
}

const JobList: React.FC<IJobListProps> = ({
  options,
  total,
  loading,
  error,
  empty,
  onOrderingChange,
  onFiltersChange,
  onCardChange,
  slotProps: { card: cardProps, ...slotProps } = {},
  ...props
}) => {
  return (
    <PaginatedList
      total={total}
      params={options.params}
      loading={loading}
      error={error}
      empty={
        total === 0 || empty === true
          ? {
              label: "No Jobs Found",
              icon: <JobIcons.List fontSize="large" />,
              ...(options.params.search
                ? { description: `No results for "${options.params.search}".` }
                : { actions: [<JobCreateButton />] }),
            }
          : empty
      }
      renderItem={(job) => (
        <JobListCard
          key={job.id}
          job={job}
          onChange={onCardChange}
          {...(typeof cardProps === "function" ? cardProps(job) : cardProps)}
        />
      )}
      renderSkeletonItem
      slotProps={{
        ...slotProps,
        header: {
          ...((!!onOrderingChange || !!onFiltersChange) && {
            endContent: (
              <Stack direction="row" spacing={1}>
                {!!onOrderingChange && (
                  <JobListOrderingButtonGroup
                    value={options.params.ordering}
                    onChange={onOrderingChange}
                    {...slotProps?.orderingButtonGroup}
                  />
                )}
                {!!onFiltersChange && (
                  <JobListFiltersIconButton
                    form={{
                      values: {
                        completed: options.params.completed,
                        scheduled: options.params.scheduled,
                      },
                      onSubmit: onFiltersChange,
                    }}
                    {...slotProps?.filtersIconButton}
                  />
                )}
              </Stack>
            ),
          }),
          ...slotProps?.header,
        },
      }}
      {...props}
    />
  );
};

export default JobList;
