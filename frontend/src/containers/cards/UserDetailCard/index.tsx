import { type ComponentProps } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import Metadata from "@/components/lists/Metadata";
import type { User } from "@/store/types/account";
import UserGroupChip from "@/containers/chips/UserGroupChip";

interface UserDetailCardProps extends CardProps {
  user: User;
}

const UserDetailCard = ({ user, ...props }: UserDetailCardProps) => {
  /** Values */

  const fullName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.last_name || null;

  const metadata: ComponentProps<typeof Metadata>["items"] = [
    {
      id: "id",
      label: "ID",
      value: String(user.id),
    },
    {
      id: "email",
      label: "Email",
      value: user.email,
    },
    {
      id: "permissions",
      label: "Permissions",
      value: (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {user.groups.map((group) => (
            <UserGroupChip key={group} group={group} size="xxs" />
          ))}
        </Stack>
      ),
    },
  ];

  return (
    <Card variant="outlined" {...props}>
      <CardContent component={Stack} spacing={1}>
        <Stack>
          <Typography variant="h6">{user.username}</Typography>
          {fullName && (
            <Typography variant="caption" color="text.secondary">
              {fullName}
            </Typography>
          )}
        </Stack>
        <Metadata items={metadata} />
      </CardContent>
    </Card>
  );
};

export default UserDetailCard;
