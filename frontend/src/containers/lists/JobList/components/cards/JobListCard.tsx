import { Stack } from "@mui/material";
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
      description={
        <Metadata
          items={[
            {
              id: "recipients",
              label: `Recipient${job.recipients.length > 1 ? "s" : ""}`,
              value: (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {job.recipients.length ? (
                    job.recipients.map((recipient) => (
                      <ContactChip
                        key={recipient.id}
                        contact={recipient}
                        size="xxs"
                      />
                    ))
                  ) : (
                    <EmptyChip size="xxs" />
                  )}
                </Stack>
              ),
            },
            {
              id: "address",
              label: "Address",
              value: job.place?.address_short || <EmptyChip size="xxs" />,
            },
          ]}
        />
      }
      link={{ to: "/app/jobs/$id", params: { id: String(job.id) } }}
      disabled={jobHook.disabled}
      options={jobHook.options}
      {...(onClick && { onClick: (event) => onClick(job, event) })}
      {...props}
    />
  );
};

export default JobListCard;
