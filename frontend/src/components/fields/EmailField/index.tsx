import { TextField, type TextFieldProps } from "@mui/material";

const EmailField = (props: TextFieldProps) => {
  return <TextField type="email" placeholder="email@domain.com" {...props} />;
};

export default EmailField;
