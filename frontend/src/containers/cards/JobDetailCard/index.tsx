import {
  Card,
  CardContent,
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
        <Typography
          variant="h5"
          {...(!job.label && { color: "text.secondary", fontStyle: "italic" })}
        >
          {job.label || "Untitled"}
        </Typography>
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
              id: "location",
              label: "Location",
              value: job.place ? null : <EmptyChip size="xxs" />,
            },
          ]}
        />
        <Metadata
          items={[
            {
              id: "representative",
              label: "Sales Representative",
              value: job.representative ? (
                <ContactChip contact={job.representative} size="xxs" />
              ) : (
                <EmptyChip size="xxs" />
              ),
            },
            {
              id: "assignee",
              label: "Assigned to",
              value: job.assignee ? (
                <ContactChip contact={job.assignee} size="xxs" />
              ) : (
                <EmptyChip size="xxs" />
              ),
            },
            {
              id: "referred_by",
              label: "Referred by",
              value: job.referred_by ? (
                <ContactChip contact={job.referred_by} size="xxs" />
              ) : (
                <EmptyChip size="xxs" />
              ),
            },
          ]}
        />
        <Typography variant="subtitle2">Description</Typography>
        <Typography
          variant="body2"
          {...(job.description
            ? {}
            : { color: "text.secondary", fontStyle: "italic" })}
        >
          {job.description || "No description."}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobDetailCard;
