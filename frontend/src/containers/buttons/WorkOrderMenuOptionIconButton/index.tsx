import { type ComponentProps } from "react";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Delete, Edit, Info } from "@mui/icons-material";
import { workOrderQueries } from "@/store/queries/workOrders";
import { workOrderMutations } from "@/store/mutations/work-orders";
import useConfirm from "@/store/hooks/useConfirm";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import type { WorkOrder } from "@/store/types";

interface WorkOrderMenuOptionIconButtonProps
  extends Omit<ComponentProps<typeof MenuOptionIconButton>, "options"> {
  workOrder: WorkOrder | WorkOrder["id"];
}

const WorkOrderMenuOptionIconButton = ({
  workOrder: workOrderProp,
  ...props
}: WorkOrderMenuOptionIconButtonProps) => {
  /** Values */

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const matches = useMatches();

  const isId = typeof workOrderProp === "string";
  const workOrderId = isId ? workOrderProp : workOrderProp.id;

  const isDetail = matches.some((m) => m.routeId === "/app/work-orders/$id");

  /** Queries */

  const workOrderDetailQuery = useQuery({
    ...workOrderQueries.detail(workOrderId),
    enabled: isId,
  });

  /** Mutations */

  const deleteWorkOrderMutation = useMutation(workOrderMutations.delete());

  /** Data */

  const workOrder = isId ? workOrderDetailQuery.data : workOrderProp;
  const workOrderLabel = workOrder ? workOrder.label : "Work Order";

  /** Callbacks */

  const handleDeleteWorkOrder = () => {
    deleteWorkOrderMutation.mutate(workOrderId, {
      onSuccess: () => {
        queryClient.invalidateQueries(workOrderQueries.list());
        navigate({ to: "/app/work-orders" });
      },
    });
  };

  /** Options */

  const options: MenuOption[] = [
    {
      id: "detail",
      render: !isDetail,
      label: "Detail",
      icon: <Info />,
      onClick: () =>
        navigate({ to: "/app/work-orders/$id", params: { id: workOrderId } }),
    },
    {
      id: "edit",
      label: "Edit",
      icon: <Edit />,
      onClick: () =>
        navigate({
          to: "/app/work-orders/$id",
          params: { id: workOrderId },
          search: { edit: true },
        }),
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Delete />,
      color: "error",
      onClick: () =>
        confirm(`Delete ${workOrderLabel}?`, handleDeleteWorkOrder),
    },
  ];

  return (
    <MenuOptionIconButton title={workOrderLabel} options={options} {...props} />
  );
};

export default WorkOrderMenuOptionIconButton;
