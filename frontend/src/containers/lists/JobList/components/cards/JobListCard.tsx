import { Stack } from "@mui/material";
import useJob, { type IUseJobOptions } from "@/store/hooks/useJob";
import Metadata from "@/components/lists/Metadata";
import ListCard, { type IListCardProps } from "@/components/cards/ListCard";
import { JobIcons } from "@/store/constants/jobs";
import type { TJob } from "@/store/types/jobs";

type TListCardProps = Omit<IListCardProps, "options" | "onClick" | "onChange">;

interface IJobListCardProps extends Partial<TListCardProps>, IUseJobOptions {
  job: TJob;
  onClick?: (
    job: TJob,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const JobListCard: React.FC<IJobListCardProps> = ({
  job,
  hideOptions,
  disabled,
  options,
  onClick,
  onChange,
  ...props
}) => {
  /** Values */

  const jobHook = useJob(job, {
    options,
    disabled,
    hideOptions,
    onChange,
  });

  const label = job.label || `Job ${job.id}`;

  return (
    <ListCard
      startContent={<JobIcons.Detail fontSize="large" color="disabled" />}
      label={label}
      description={<Metadata items={[]} />}
      link={{
        to: "/app/board/jobs/$id",
        params: { id: String(job.id) },
      }}
      disabled={jobHook.disabled}
      options={jobHook.options}
      {...(onClick && { onClick: (event) => onClick(job, event) })}
      {...props}
    />
  );
};

export default JobListCard;
