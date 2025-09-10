import { type ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import DollarField from "@/components/fields/DollarField";
import type { WorkOrderFormValues } from "..";

const WorkOrderFormCostField = (props: ComponentProps<typeof DollarField>) => {
  /** Values */

  const methods = useFormContext<WorkOrderFormValues>();

  return (
    <DollarField
      label="Cost"
      required
      error={Boolean(methods.formState.errors.cost)}
      helperText={methods.formState.errors.cost?.message}
      fullWidth
      {...methods.register("cost", {
        required: "Cost is required",
      })}
      {...props}
    />
  );
};

export default WorkOrderFormCostField;
