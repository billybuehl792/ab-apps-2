import {
  Card,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import dayjs from "dayjs";
import Metadata from "@/components/lists/Metadata";
import { DateTimeFormat } from "@/store/enums/datetime";
import type { TContact } from "@/store/types/contacts";

interface IContactDetailCardProps extends CardProps {
  contact: TContact;
}

const ContactDetailCard = ({ contact, ...props }: IContactDetailCardProps) => {
  return (
    <Card variant="outlined" {...props}>
      <CardContent component={Stack} spacing={1}>
        <Typography variant="h6">{`${contact.first_name} ${contact.last_name}`}</Typography>
        <Metadata
          items={[
            {
              id: "email",
              label: "Email",
              value: contact.email,
            },
            {
              id: "phone",
              label: "Phone",
              value: contact.phone_primary.toPhone(),
            },
            {
              id: "created",
              label: "Created",
              value: dayjs(contact.created_at).fromNow(),
              tooltip: dayjs(contact.created_at).format(
                DateTimeFormat.DATETIME_MERIDIEM,
              ),
            },
            {
              id: "updated",
              label: "Updated",
              value: dayjs(contact.updated_at).fromNow(),
              tooltip: dayjs(contact.updated_at).format(
                DateTimeFormat.DATETIME_MERIDIEM,
              ),
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default ContactDetailCard;
