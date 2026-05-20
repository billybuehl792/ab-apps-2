import useJob, { type IUseJobOptions } from "@/store/hooks/useJob";
import Metadata from "@/components/lists/Metadata";
import ListCard, { type IListCardProps } from "@/components/cards/ListCard";
import EmptyChip from "@/components/chips/EmptyChip";
import ContactChip from "@/containers/chips/ContactChip";
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
  slotProps,
  ...props
}) => {
  /** Values */

  const jobHook = useJob(job, {
    options,
    disabled,
    hideOptions,
    onChange,
  });

  return (
    <ListCard
      startContent={<JobIcons.Detail fontSize="large" color="disabled" />}
      label={job.label || "Untitled"}
      description={
        <Metadata
          items={[
            {
              id: "recipient",
              label: "Recipient",
              value: job.recipient ? (
                <ContactChip contact={job.recipient} size="xxs" />
              ) : (
                <EmptyChip size="xxs" />
              ),
            },
            {
              id: "address",
              label: "Address",
              value: job.place?.address_short || <EmptyChip size="xxs" />,
            },
            {
              id: "amount",
              label: "Amount",
              value: job.amount || "-",
            },
          ]}
        />
      }
      link={{
        to: "/app/board/jobs/$id",
        params: { id: String(job.id) },
      }}
      disabled={jobHook.disabled}
      options={jobHook.options}
      {...(onClick && { onClick: (event) => onClick(job, event) })}
      slotProps={{
        ...slotProps,
        cardContent: {
          ...slotProps?.cardContent,
          slotProps: {
            label: {
              sx: [
                !job.label && { fontStyle: "italic", color: "text.secondary" },
              ],
            },
          },
        },
      }}
      {...props}
    />
  );
};

export default JobListCard;
