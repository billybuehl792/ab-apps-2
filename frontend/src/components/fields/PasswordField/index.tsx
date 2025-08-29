import { useState } from "react";
import {
  IconButton,
  type IconButtonProps,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordField = (props: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  /** Callbacks */

  const handleTogglePasswordVisibility: IconButtonProps["onClick"] = () => {
    setShowPassword((show) => !show);
  };

  const handleIconButtonMouseEvent: IconButtonProps["onMouseDown"] = (
    event
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      type={showPassword ? "text" : "password"}
      {...props}
      slotProps={{
        ...props.slotProps,
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                disabled={props.disabled}
                onMouseDown={handleIconButtonMouseEvent}
                onMouseUp={handleIconButtonMouseEvent}
                onClick={handleTogglePasswordVisibility}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          ...props.slotProps?.input,
        },
      }}
    />
  );
};

export default PasswordField;
