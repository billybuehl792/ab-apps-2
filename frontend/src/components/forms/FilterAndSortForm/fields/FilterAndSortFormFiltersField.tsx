import { type ComponentProps } from "react";
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
  StackProps,
  Tooltip,
} from "@mui/material";
import FilterAndSortForm, { type FilterAndSortFormValues } from "..";
import { FilterAltOff } from "@mui/icons-material";

interface FilterAndSortFormFiltersFieldProps extends StackProps {
  label?: ComponentProps<typeof FilterAndSortForm>["filterLabel"];
  options: NonNullable<
    ComponentProps<typeof FilterAndSortForm>["filterOptions"]
  >;
}

const FilterAndSortFormFiltersField = ({
  label = "Filter By",
  options,
  ...props
}: FilterAndSortFormFiltersFieldProps) => {
  /** Values */

  const methods = useFormContext<FilterAndSortFormValues>();

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
                  key={String(option.value)}
                  value={option.value}
                  label={option.label}
                  checked={value.some(({ value }) => value === option.value)}
                  disabled={option.disabled || disabled}
                  control={
                    <Checkbox
                      onChange={(_, checked) => {
                        if (checked) onChange([...value, option]);
                        else
                          onChange(
                            value.filter(({ value }) => value !== option.value)
                          );
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

export default FilterAndSortFormFiltersField;
