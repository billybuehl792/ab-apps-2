import {
  Card,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import Metadata from "@/components/lists/Metadata";
import type { TJob } from "@/store/types/jobs";

interface IJobDetailCardProps extends CardProps {
  job: TJob;
}

const JobDetailCard = ({ job, ...props }: IJobDetailCardProps) => {
  return (
    <Card variant="outlined" {...props}>
      <CardContent component={Stack} spacing={1}>
        <Typography variant="h6">{job.label || `Job ${job.id}`}</Typography>
        <Metadata items={[]} />
      </CardContent>
    </Card>
  );
};

export default JobDetailCard;
