import { Controller, useFormContext } from "react-hook-form";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { WorkOrderListRequestParamsOrdering } from "@/store/enums/work-orders";
import type { WorkOrderListParamsFormValues } from "..";

const WorkOrderListParamsFormOrderingField = ({
  disabled,
}: {
  disabled?: boolean;
}) => {
  /** Values */

  const methods = useFormContext<WorkOrderListParamsFormValues>();

  return (
    <Controller
      name="ordering"
      control={methods.control}
      render={({ field: { name, value, onChange, ...field } }) => (
        <RadioGroup
          name={name}
          aria-labelledby={`${name}-label`}
          value={value ?? ""}
          onChange={(_event, value) => onChange(value || null)}
          {...field}
        >
          <FormControlLabel
            value=""
            label="None"
            control={<Radio />}
            sx={{ color: "text.disabled" }}
          />
          {Object.entries(WorkOrderListRequestParamsOrdering).map(
            ([key, value]) => (
              <FormControlLabel
                key={key}
                value={value}
                label={value.snakeCaseToTitleCase()}
                control={<Radio />}
                disabled={disabled}
              />
            )
          )}
        </RadioGroup>
      )}
    />
  );
};

export default WorkOrderListParamsFormOrderingField;
