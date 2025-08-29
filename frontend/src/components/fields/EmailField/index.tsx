import { TextField, type TextFieldProps } from "@mui/material";

const EmailField = (props: TextFieldProps) => {
  return <TextField type="email" {...props} />;
};

export default EmailField;
