import { Link } from "@tanstack/react-router";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import { ArrowForwardIos, Person } from "@mui/icons-material";
import UserGroupChip from "@/containers/chips/UserGroupChip";
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
      <Link
        to="/app/admin/users/$id"
        params={{ id: String(user.id) }}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CardActionArea>
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
              <Person color="disabled" />
              <Stack overflow="hidden">
                <Typography variant="body1" noWrap>
                  {user.username}
                </Typography>
                <Typography variant="caption" noWrap>
                  {fullName}
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
        </CardActionArea>
      </Link>
    </Stack>
  );
};

export default UserListCard;
