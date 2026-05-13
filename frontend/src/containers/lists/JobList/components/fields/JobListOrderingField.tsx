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

const OPTIONS_MAP = new Map<EJobListOrdering, string>([
  [EJobListOrdering.AmountAsc, "Amount (Low to High)"],
  [EJobListOrdering.AmountDesc, "Amount (High to Low)"],
  [EJobListOrdering.UpdatedAtDesc, "Last Updated"],
  [EJobListOrdering.CreatedAtDesc, "Last Created"],
]);
const OPTIONS = Array.from(OPTIONS_MAP.entries());

const JobListOrderingField: React.FC<IJobListOrderingFieldProps> = ({
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
        onChange={(e) => {
          e.target.value
            ? onChange(e.target.value as EJobListOrdering)
            : onChange(null);
        }}
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

export default JobListOrderingField;
