import { type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grow,
  IconButton,
  Stack,
  type StackProps,
  Tooltip,
} from "@mui/material";
import { FilterAltOff } from "@mui/icons-material";
import type { FilterOption, OrderingAndFiltersFormValues } from "..";

interface OrderingAndFiltersFormFiltersFieldProps extends StackProps {
  label?: ReactNode;
  options: ReadonlyArray<FilterOption>;
}

const OrderingAndFiltersFormFiltersField = ({
  label = "Filter By",
  options,
  ...props
}: OrderingAndFiltersFormFiltersFieldProps) => {
  /** Values */

  const methods = useFormContext<OrderingAndFiltersFormValues>();

  return (
    <Controller
      name="filters"
      control={methods.control}
      render={({ field: { ref, value = [], disabled, onChange, onBlur } }) => (
        <Stack spacing={1} {...props}>
          <FormControl component="fieldset">
            <Stack direction="row" spacing={1} alignItems="center">
              <FormLabel component="legend">{label}</FormLabel>
              <Grow in={Boolean(value.length)}>
                <Tooltip title="Clear selection">
                  <IconButton size="small" onClick={() => onChange([])}>
                    <FilterAltOff />
                  </IconButton>
                </Tooltip>
              </Grow>
            </Stack>
            <FormGroup ref={ref}>
              {options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.value}
                  label={option.label}
                  checked={value.some(({ id }) => id === option.id)}
                  disabled={option.disabled || disabled}
                  control={
                    <Checkbox
                      onChange={(_, checked) => {
                        if (checked) onChange([...value, option]);
                        else
                          onChange(value.filter(({ id }) => id !== option.id));
                      }}
                      onBlur={onBlur}
                    />
                  }
                />
              ))}
            </FormGroup>
          </FormControl>
        </Stack>
      )}
    />
  );
};

export default OrderingAndFiltersFormFiltersField;
