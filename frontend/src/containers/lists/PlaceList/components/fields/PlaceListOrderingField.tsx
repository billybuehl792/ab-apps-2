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

const OPTIONS_MAP = new Map<EPlaceListOrdering, string>([
  [EPlaceListOrdering.CityAsc, "City"],
  [EPlaceListOrdering.UpdatedAtDesc, "Last Updated"],
  [EPlaceListOrdering.CreatedAtDesc, "Last Created"],
]);
const OPTIONS = Array.from(OPTIONS_MAP.entries());

const PlaceListOrderingField: React.FC<IPlaceListOrderingFieldProps> = ({
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
        value={value}
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
            ? onChange(e.target.value as EPlaceListOrdering)
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

export default PlaceListOrderingField;
