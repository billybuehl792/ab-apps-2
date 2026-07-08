import React, { Fragment, type ReactNode } from "react";
import { Pagination, Stack, type StackProps } from "@mui/material";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import StatusWrapper, {
  type IStatusWrapperBaseProps,
} from "@/components/layout/StatusWrapper";
import JobListCard from "./components/cards/JobListCard";
import JobListOrderingField from "./components/fields/JobListOrderingField";
import JobListStatusField from "./components/fields/JobListStatusField";
import { EJobListOrdering, EJobStatus } from "@/store/enums/jobs";
import { sxUtils } from "@/store/utils/sx";
import type { TJob } from "@/store/types/jobs";

type TCardProps = Partial<
  Omit<React.ComponentProps<typeof JobListCard>, "job">
>;

export interface IJobListProps extends StackProps, IStatusWrapperBaseProps {
  items: TJob[];
  count: number;
  page: number;
  pageSize: number;
  search?: string;
  ordering?: EJobListOrdering | null;
  status?: EJobStatus | null;
  disabled?: boolean;
  renderCard?: (job: TJob) => ReactNode;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (search: string) => void;
  onOrderingChange?: (ordering: EJobListOrdering | null) => void;
  onStatusChange?: (status: EJobStatus | null) => void;
  slotProps?: {
    root?: StackProps;
    header?: StackProps;
    list?: StackProps;
    card?: TCardProps | ((job: TJob) => TCardProps);
  };
}

const JobList: React.FC<IJobListProps> = ({
  items,
  count,
  page,
  pageSize,
  search,
  ordering,
  status,
  loading,
  error,
  empty,
  disabled,
  renderCard,
  onSearchChange,
  onOrderingChange,
  onPageChange,
  onPageSizeChange,
  onStatusChange,
  slotProps,
  ...props
}) => {
  /** Values */

  const showHeader = !!onSearchChange || !!onOrderingChange || !!onStatusChange;
  const pageCount = Math.ceil(count / pageSize);

  /** Callbacks */

  const handleRenderCard: IJobListProps["renderCard"] =
    renderCard ??
    ((job) => (
      <JobListCard
        job={job}
        {...(typeof slotProps?.card === "function"
          ? slotProps.card(job)
          : slotProps?.card)}
      />
    ));

  return (
    <Stack position="relative" spacing={2} {...slotProps?.root} {...props}>
      {!!showHeader && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          {...slotProps?.header}
          sx={[
            {
              py: 2,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            },
            ...sxUtils.asArray(slotProps?.header?.sx),
          ]}
        >
          {!!onSearchChange && (
            <DebouncedSearchField
              value={search}
              size="small"
              loading={!!loading && !!search}
              onChange={onSearchChange}
              sx={{ flex: 1 }}
            />
          )}
          {!!onOrderingChange && (
            <JobListOrderingField
              value={ordering ?? null}
              disabled={disabled || !!loading}
              size="small"
              onChange={onOrderingChange}
              sx={{ width: { xs: "100%", sm: 160 } }}
            />
          )}
          {!!onStatusChange && (
            <JobListStatusField
              value={status ?? null}
              disabled={disabled || !!loading}
              size="small"
              onChange={onStatusChange}
              sx={{ py: 1, width: { xs: "100%" } }}
            />
          )}
        </Stack>
      )}
      <Stack spacing={1} {...slotProps?.list}>
        <StatusWrapper
          loading={loading}
          error={error}
          empty={
            empty ||
            (items.length === 0 && {
              label: `No ${status + " "}Jobs`,
              description: search?.trim()
                ? `No ${status + " "}jobs found for "${search}"`
                : undefined,
            })
          }
          flexGrow={1}
        >
          {items.map((job) => (
            <Fragment key={job.id}>{handleRenderCard(job)}</Fragment>
          ))}
        </StatusWrapper>
      </Stack>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Pagination
          page={page}
          count={pageCount}
          variant="outlined"
          disabled={disabled || !!loading}
          onChange={(_, newPage) => page !== newPage && onPageChange?.(newPage)}
        />
      </Stack>
    </Stack>
  );
};

export default JobList;
