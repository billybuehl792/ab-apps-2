import {
  InputAdornment,
  TextField,
  Typography,
  type TextFieldProps,
} from "@mui/material";

const PhoneField = (props: TextFieldProps) => {
  return (
    <TextField
      type="tel"
      placeholder="000-000-0000"
      {...props}
      slotProps={{
        ...props.slotProps,
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Typography variant="body1">+1</Typography>
            </InputAdornment>
          ),
          ...props.slotProps?.input,
        },
      }}
    />
  );
};

export default PhoneField;
