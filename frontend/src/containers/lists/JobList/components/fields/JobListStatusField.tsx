import { Chip, type ChipProps, Stack, type StackProps } from "@mui/material";
import { EJobStatus } from "@/store/enums/jobs";
import { sxUtils } from "@/store/utils/sx";

export interface IJobListStatusFieldProps extends Omit<StackProps, "onChange"> {
  value: EJobStatus | null;
  disabled?: boolean;
  size?: ChipProps["size"];
  onChange: (status: EJobStatus | null) => void;
}

const JobListStatusField: React.FC<IJobListStatusFieldProps> = ({
  value,
  disabled,
  size,
  onChange,
  ...props
}) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      {...props}
      sx={[{ overflowX: "auto" }, ...sxUtils.asArray(props?.sx)]}
    >
      <Chip
        label="All"
        disabled={disabled}
        size={size}
        color={value === null ? "primary" : "default"}
        onClick={() => onChange(null)}
      />
      {Object.values(EJobStatus).map((status) => (
        <Chip
          key={status}
          label={status}
          disabled={disabled}
          size={size}
          color={value === status ? "primary" : "default"}
          onClick={() => onChange(value === status ? null : status)}
        />
      ))}
    </Stack>
  );
};

export default JobListStatusField;
