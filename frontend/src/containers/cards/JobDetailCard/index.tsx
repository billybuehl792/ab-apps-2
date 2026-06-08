import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import Metadata from "@/components/lists/Metadata";
import ContactChip from "@/containers/chips/ContactChip";
import EmptyChip from "@/components/chips/EmptyChip";
import type { TJob } from "@/store/types/jobs";

interface IJobDetailCardProps extends CardProps {
  job: TJob;
}

const JobDetailCard = ({ job, ...props }: IJobDetailCardProps) => {
  return (
    <Card variant="outlined" {...props}>
      <CardContent component={Stack} spacing={1}>
        <Metadata
          items={[
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
          ]}
        />
        <Metadata
          items={[
            {
              id: "representative",
              label: "Sales Representative(s)",
              value:
                job.representatives.length > 0 ? (
                  <Stack spacing={0.5} direction="row" flexWrap="wrap">
                    {job.representatives.map((representative) => (
                      <ContactChip
                        key={representative.id}
                        contact={representative}
                        size="xxs"
                      />
                    ))}
                  </Stack>
                ) : (
                  <EmptyChip size="xxs" />
                ),
            },
            {
              id: "assignees",
              label: `Assignee(s)`,
              value:
                job.assignees.length > 0 ? (
                  <Stack spacing={0.5} direction="row" flexWrap="wrap">
                    {job.assignees.map((assignee) => (
                      <ContactChip
                        key={assignee.id}
                        contact={assignee}
                        size="xxs"
                      />
                    ))}
                  </Stack>
                ) : (
                  <EmptyChip size="xxs" />
                ),
            },
            {
              id: "referred_by",
              label: "Referred by",
              value:
                job.referred_by.length > 0 ? (
                  <Stack spacing={0.5} direction="row" flexWrap="wrap">
                    {job.referred_by.map((referrer) => (
                      <ContactChip
                        key={referrer.id}
                        contact={referrer}
                        size="xxs"
                      />
                    ))}
                  </Stack>
                ) : (
                  <EmptyChip size="xxs" />
                ),
            },
          ]}
        />
        <Typography variant="subtitle2">Description</Typography>
        <Typography
          variant="body2"
          {...(!job.description && {
            color: "text.secondary",
            fontStyle: "italic",
          })}
        >
          {job.description || "No description."}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobDetailCard;
