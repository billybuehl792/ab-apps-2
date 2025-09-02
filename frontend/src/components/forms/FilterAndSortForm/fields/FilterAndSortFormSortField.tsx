import { type ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grow,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  type StackProps,
} from "@mui/material";
import FilterAndSortForm, { type FilterAndSortFormValues } from "..";
import { FilterListOff } from "@mui/icons-material";

interface FilterAndSortFormSortFieldProps extends StackProps {
  label?: ComponentProps<typeof FilterAndSortForm>["orderingLabel"];
  options: NonNullable<
    ComponentProps<typeof FilterAndSortForm>["orderingOptions"]
  >;
}

const FilterAndSortFormSortField = ({
  label = "Sort By",
  options,
  ...props
}: FilterAndSortFormSortFieldProps) => {
  /** Values */

  const methods = useFormContext<FilterAndSortFormValues>();

  return (
    <Controller
      name="ordering"
      control={methods.control}
      render={({ field: { name, value = null, onChange, ...field } }) => (
        <Stack spacing={1} {...props}>
          <FormControl>
            <Stack direction="row" spacing={1} alignItems="center">
              <FormLabel id={`${name}-label`}>{label}</FormLabel>
              <Grow in={Boolean(value)}>
                <Tooltip title="Clear selection">
                  <IconButton size="small" onClick={() => onChange(null)}>
                    <FilterListOff />
                  </IconButton>
                </Tooltip>
              </Grow>
            </Stack>
            <RadioGroup
              name={name}
              aria-labelledby={`${name}-label`}
              value={value?.value || ""}
              onChange={(_, value) => {
                const selectedOption = options.find(
                  (option) => option.value === value
                );
                onChange(selectedOption || null);
              }}
              {...field}
            >
              <FormControlLabel
                value=""
                label="None"
                control={<Radio />}
                sx={{ color: ({ palette }) => palette.text.disabled }}
              />
              {options.map((option) => (
                <FormControlLabel
                  key={String(option.value)}
                  value={option.value}
                  label={option.label}
                  control={<Radio />}
                  disabled={option.disabled}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Stack>
      )}
    />
  );
};

export default FilterAndSortFormSortField;
