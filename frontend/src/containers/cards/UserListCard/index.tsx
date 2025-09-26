import {
  Card,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import CardActionAreaLink from "@/components/links/CardActionAreaLink";
import UserGroupChip from "@/containers/chips/UserGroupChip";
import { ADMIN_USER_ICON } from "@/store/constants/admin";
import type { User } from "@/store/types/account";

interface UserListCardProps extends CardProps {
  user: User;
}

const UserListCard = ({ user, ...props }: UserListCardProps) => {
  /** Values */

  const fullName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.last_name || null;

  return (
    <Stack component={Card} position="relative" {...props}>
      <CardActionAreaLink
        to="/app/dashboard/admin/users/$id"
        params={{ id: String(user.id) }}
      >
        <CardContent
          component={Stack}
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            flexGrow={1}
            overflow="hidden"
          >
            <ADMIN_USER_ICON fontSize="large" color="disabled" />
            <Stack overflow="hidden">
              <Typography variant="body1" noWrap>
                {user.username}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                {...(!fullName && {
                  fontStyle: "italic",
                  color: "text.disabled",
                })}
              >
                {fullName ?? "No Name"}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="end"
            useFlexGap
            flexWrap="wrap"
            flexShrink={2}
          >
            {user.groups.map((group) => (
              <UserGroupChip key={group} group={group} size="xs" />
            ))}
          </Stack>
          <ArrowForwardIos fontSize="xs" />
        </CardContent>
      </CardActionAreaLink>
    </Stack>
  );
};

export default UserListCard;
