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

const OPTIONS = new Map<EContactListOrdering, string>([
  [EContactListOrdering.FirstNameAsc, "First Name"],
  [EContactListOrdering.LastNameAsc, "Last Name"],
  [EContactListOrdering.UpdatedAtDesc, "Last Updated"],
  [EContactListOrdering.CreatedAtDesc, "Last Created"],
]);

const ContactListOrderingField: React.FC<IContactListOrderingFieldProps> = ({
  value,
  onChange,
  ...props
}) => {
  /** Values */

  const sanitizedValue = value && OPTIONS.has(value) ? value : "";

  return (
    <FormControl {...props}>
      <Select
        label="Ordering"
        value={sanitizedValue}
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
          selected && OPTIONS.has(selected) ? (
            OPTIONS.get(selected)
          ) : (
            <Box component="span" fontStyle="italic" color="text.secondary">
              Ordering
            </Box>
          )
        }
        onChange={(e) => onChange(e.target.value || null)}
      >
        <MenuItem value="">
          <Box component="span" fontStyle="italic" color="text.secondary">
            None
          </Box>
        </MenuItem>
        {Array.from(OPTIONS.entries()).map(([key, label]) => (
          <MenuItem key={key} value={key}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ContactListOrderingField;
