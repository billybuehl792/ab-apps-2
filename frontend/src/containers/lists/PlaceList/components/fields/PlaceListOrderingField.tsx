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
import { EPlaceListOrdering } from "@/store/enums/places";

interface IPlaceListOrderingFieldProps extends Omit<
  FormControlProps,
  "value" | "onChange"
> {
  value: EPlaceListOrdering | null;
  onChange: (value: EPlaceListOrdering | null) => void;
}

const OPTIONS = new Map<EPlaceListOrdering, string>([
  [EPlaceListOrdering.CityAsc, "City"],
  [EPlaceListOrdering.UpdatedAtDesc, "Last Updated"],
  [EPlaceListOrdering.CreatedAtDesc, "Last Created"],
]);

const PlaceListOrderingField: React.FC<IPlaceListOrderingFieldProps> = ({
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

export default PlaceListOrderingField;
