import { Fragment, type ReactNode } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import dayjs from "dayjs";
import Metadata from "@/components/lists/Metadata";
import type { TContact } from "@/store/types/contacts";

interface IContactDetailCardProps extends Omit<CardProps, "children"> {
  contact: TContact;
  actions?: ReactNode[];
}

const ContactDetailCard = ({
  contact,
  actions,
  ...props
}: IContactDetailCardProps) => {
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
              id: "address",
              label: "Address",
              value: contact.place ? contact.place.address_short : "N/A",
            },
            {
              id: "created",
              label: "Created",
              value: dayjs(contact.created_at).fromNow(),
            },
            {
              id: "updated",
              label: "Updated",
              value: dayjs(contact.updated_at).fromNow(),
            },
          ]}
        />
      </CardContent>
      {actions && (
        <CardActions sx={{ pt: 0 }}>
          {actions.map((action, index) => (
            <Fragment key={index}>{action}</Fragment>
          ))}
        </CardActions>
      )}
    </Card>
  );
};

export default ContactDetailCard;
