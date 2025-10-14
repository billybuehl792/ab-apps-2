import { type ComponentProps, type ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import { type DefaultValues } from "react-hook-form";
import Drawer from "@/components/modals/Drawer";
import type Form from "@/components/forms/Form";
import type { ListRequestParams } from "@/store/types/api";
import type { PaginatedQueryListBaseProps } from "../..";

interface PaginatedQueryListParamsFormDrawerProps<
  Params extends ListRequestParams,
  Data = unknown,
> extends ComponentProps<typeof Drawer>,
    PaginatedQueryListBaseProps<Params, Data> {
  FormComponent: ComponentType<ComponentProps<typeof Form<Params>>>;
}

const PaginatedQueryListParamsFormDrawer = <
  Params extends ListRequestParams,
  Data = unknown,
>({
  queryOptions,
  baseParams,
  FormComponent,
  onParamsChange,
  ...props
}: PaginatedQueryListParamsFormDrawerProps<Params, Data>) => {
  /** Values */

  const params = queryOptions.queryKey[1] as Params;

  /** Queries */

  const query = useQuery(queryOptions);

  /** Callbacks */

  const handleParamsChange = (newParams: Params) =>
    onParamsChange({ ...newParams, ...baseParams });

  return (
    <Drawer title="List Options" fullHeight {...props}>
      <FormComponent
        values={params}
        defaultValues={(baseParams ?? {}) as DefaultValues<Params>}
        disabled={query.isLoading}
        resetLabel="Cancel"
        resetOptions={{ keepDefaultValues: true }}
        onSubmit={handleParamsChange}
        onReset={props.onClose}
        onSuccess={props.onClose}
        slotProps={{
          container: { flexGrow: 1 },
          fieldset: { flexGrow: 1, mx: 2, pb: 2 },
          actions: {
            direction: "column-reverse",
            position: "sticky",
            bottom: 0,
            p: 2,
            pt: 0,
            bgcolor: (theme) => theme.palette.background.paper,
            zIndex: 2,
          },
        }}
      />
    </Drawer>
  );
};

export default PaginatedQueryListParamsFormDrawer;
