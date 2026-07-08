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
import { EJobListOrdering } from "@/store/enums/jobs";

interface IJobListOrderingFieldProps extends Omit<
  FormControlProps,
  "value" | "onChange"
> {
  value: EJobListOrdering | null;
  onChange: (value: EJobListOrdering | null) => void;
}

const OPTIONS = new Map<EJobListOrdering, string>([
  [EJobListOrdering.AmountAsc, "Amount (Low to High)"],
  [EJobListOrdering.AmountDesc, "Amount (High to Low)"],
  [EJobListOrdering.UpdatedAtDesc, "Last Updated"],
  [EJobListOrdering.CreatedAtDesc, "Last Created"],
]);

const JobListOrderingField: React.FC<IJobListOrderingFieldProps> = ({
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

export default JobListOrderingField;
