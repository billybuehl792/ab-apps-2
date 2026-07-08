import { JobStatusColors, JobStatusIcons } from "@/store/constants/jobs";
import { EJobStatus } from "@/store/enums/jobs";
import { Chip, type ChipProps } from "@mui/material";

export interface IJobStatusChipProps extends Omit<
  ChipProps,
  "label" | "onClick"
> {
  value: EJobStatus;
  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    value: EJobStatus,
  ) => void;
}

const JobStatusChip: React.FC<IJobStatusChipProps> = ({
  value,
  onClick,
  ...props
}) => {
  /** Values */

  const Icon = JobStatusIcons[value];
  const color = JobStatusColors[value];

  /** Callbacks */

  const handleOnClick: ChipProps["onClick"] = onClick
    ? (event) => {
        onClick(event, value);
      }
    : undefined;

  return (
    <Chip
      icon={<Icon />}
      label={value}
      color={color}
      onClick={handleOnClick}
      {...props}
    />
  );
};

export default JobStatusChip;
