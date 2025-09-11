import { Link } from "@tanstack/react-router";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import UserMenuOptionIconButton from "@/containers/buttons/UserMenuOptionIconButton";
import type { User } from "@/store/types/account";

interface UserListCardProps extends CardProps {
  user: User;
}

const UserListCard = ({ user, ...props }: UserListCardProps) => {
  return (
    <Stack component={Card} position="relative" {...props}>
      <CardActionArea LinkComponent={Link} href={`/app/users/${user.id}`}>
        <CardContent
          component={Stack}
          direction="row"
          spacing={2}
          alignItems="center"
          mr={7.5}
        >
          <Person color="disabled" />
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            flexGrow={1}
            overflow="hidden"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              overflow="hidden"
            >
              <Typography variant="body1" noWrap>
                {user.username}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          pointerEvents: "none",
        }}
      >
        <UserMenuOptionIconButton user={user} sx={{ pointerEvents: "auto" }} />
      </CardActions>
    </Stack>
  );
};

export default UserListCard;
