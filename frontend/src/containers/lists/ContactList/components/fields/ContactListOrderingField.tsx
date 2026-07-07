import React from "react";
import {
  Box,
  FormControl,
  type FormControlProps,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Sort } from "@mui/icons-material";
import { EContactListOrdering } from "@/store/enums/contacts";

interface IContactListOrderingFieldProps extends Omit<
  FormControlProps,
  "value" | "onChange"
> {
  value: EContactListOrdering | null;
  onChange: (value: EContactListOrdering | null) => void;
}

const OPTIONS_MAP = new Map<EContactListOrdering, string>([
  [EContactListOrdering.FirstNameAsc, "First Name"],
  [EContactListOrdering.LastNameAsc, "Last Name"],
  [EContactListOrdering.UpdatedAtDesc, "Last Updated"],
  [EContactListOrdering.CreatedAtDesc, "Last Created"],
]);
const OPTIONS = Array.from(OPTIONS_MAP.entries());

const ContactListOrderingField: React.FC<IContactListOrderingFieldProps> = ({
  value: valueProp,
  onChange,
  ...props
}) => {
  /** Values */

  const value = valueProp && OPTIONS_MAP.has(valueProp) ? valueProp : "";

  return (
    <FormControl {...props}>
      <Select
        label="Ordering"
        value={value || ""}
        displayEmpty
        input={
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <Sort />
              </InputAdornment>
            }
          />
        }
        renderValue={(selected) =>
          selected && OPTIONS_MAP.has(selected) ? (
            OPTIONS_MAP.get(selected)
          ) : (
            <Box component="span" fontStyle="italic" color="text.secondary">
              Ordering
            </Box>
          )
        }
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">
          <Box component="span" fontStyle="italic" color="text.secondary">
            None
          </Box>
        </MenuItem>
        {OPTIONS.map(([key, label]) => (
          <MenuItem key={key} value={key}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ContactListOrderingField;
