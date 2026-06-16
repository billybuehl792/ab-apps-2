import { useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  Avatar,
  IconButton,
  type IconButtonProps,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import useConfirm from "@/store/hooks/useConfirm";
import useAuth from "@/store/hooks/useAuth";

const MeMenuOptionIconButton: React.FC<IconButtonProps> = (props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  /** Values */

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const confirm = useConfirm();

  const userId = auth.me?.id;
  const disabled = !userId;

  /** Callbacks */

  const handleOnClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        {...(Boolean(anchorEl) && { "aria-selected": "true" })}
        disabled={disabled}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        {...props}
      >
        <Avatar />
      </IconButton>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleOnClose}
      >
        <MenuItem
          selected={location.pathname.startsWith("/app/profile")}
          disabled={!userId}
          onClick={() => {
            navigate({
              to: "/app/profile/$id",
              params: { id: String(userId) },
            });
            handleOnClose();
          }}
        >
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem
          disabled={disabled}
          onClick={() => {
            handleOnClose();
            confirm("Sign Out", () =>
              navigate({ to: "/sign-in", search: { force: true } }),
            );
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText color="error" primary="Sign Out" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default MeMenuOptionIconButton;
