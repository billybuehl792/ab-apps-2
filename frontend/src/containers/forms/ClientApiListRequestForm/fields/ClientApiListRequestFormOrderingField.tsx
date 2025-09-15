import { Controller, useFormContext } from "react-hook-form";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { ClientApiListRequestOrdering } from "@/store/enums/clients";
import type { ClientApiListRequestFormValues } from "..";

const ClientApiListRequestFormOrderingField = () => {
  /** Values */

  const methods = useFormContext<ClientApiListRequestFormValues>();

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
          {Object.entries(ClientApiListRequestOrdering).map(([key, value]) => (
            <FormControlLabel
              key={key}
              value={value}
              label={value.snakeCaseToTitleCase()}
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      )}
    />
  );
};

export default ClientApiListRequestFormOrderingField;
