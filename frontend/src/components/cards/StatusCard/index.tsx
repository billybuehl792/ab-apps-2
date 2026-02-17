import {
  Card,
  CardContent,
  type CardContentProps,
  type CardProps,
  Stack,
} from "@mui/material";
import Status, { type IStatus } from "./components/Status";

export interface IStatusCardProps extends Omit<CardProps, "children"> {
  value: IStatus;
  slotProps?: {
    root?: CardProps;
    content?: CardContentProps;
    status?: Partial<Omit<IStatus, "value">>;
  };
}

const StatusCard: React.FC<IStatusCardProps> = ({
  value,
  slotProps,
  ...props
}) => {
  return (
    <Card {...props}>
      <Stack
        component={CardContent}
        alignItems="center"
        justifyContent="center"
        {...slotProps?.content}
      >
        <Status {...value} {...slotProps?.status} />
      </Stack>
    </Card>
  );
};

export default StatusCard;
