import { Chip, Stack } from "@mui/material";
import Metadata from "@/components/lists/Metadata";
import ListCard, { type IListCardProps } from "@/components/cards/ListCard";
import EmptyChip from "@/components/chips/EmptyChip";
import ContactChip from "@/containers/chips/ContactChip";
import { JobIcons } from "@/store/constants/jobs";
import type { TJob } from "@/store/types/jobs";

type TListCardProps = Omit<IListCardProps, "onClick" | "onChange">;

interface IJobListCardProps extends Partial<TListCardProps> {
  job: TJob;
  onClick?: (
    job: TJob,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const JobListCard: React.FC<IJobListCardProps> = ({
  job,
  disabled,
  options,
  onClick,
  ...props
}) => {
  return (
    <ListCard
      startContent={<JobIcons.Detail fontSize="large" color="disabled" />}
      description={
        <Metadata
          items={[
            {
              id: "recipients",
              label: "Recipient(s)",
              value:
                job.recipients.length > 0 ? (
                  <Stack spacing={0.5} direction="row" flexWrap="wrap">
                    {job.recipients.map((recipient) => (
                      <ContactChip
                        key={recipient.id}
                        contact={recipient}
                        size="xxs"
                      />
                    ))}
                  </Stack>
                ) : (
                  <EmptyChip size="xxs" />
                ),
            },
            {
              id: "address",
              label: "Address",
              value: job.place ? (
                job.place.address_short
              ) : (
                <EmptyChip size="xxs" />
              ),
            },
            {
              id: "categories",
              label: "Categories",
              value:
                job.categories.length > 0 ? (
                  <Stack spacing={0.5} direction="row" flexWrap="wrap">
                    {job.categories.map((category) => (
                      <Chip key={category} label={category} size="xxs" />
                    ))}
                  </Stack>
                ) : (
                  <EmptyChip size="xxs" />
                ),
            },
          ]}
        />
      }
      options={options}
      {...(onClick && { onClick: (event) => onClick(job, event) })}
      {...props}
    />
  );
};

export default JobListCard;
