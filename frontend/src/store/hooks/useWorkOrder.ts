import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Delete, Edit, Info } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { workOrderQueries } from "../queries/work-orders";
import { workOrderMutations } from "../mutations/work-orders";
import type { WorkOrderBasic } from "../types/work-orders";

const useWorkOrder = (workOrder: WorkOrderBasic | number) => {
  /** Values */

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const isId = typeof workOrder === "number";
  const workOrderId = isId ? workOrder : workOrder.id;

  /** Queries */

  const workOrderQuery = useQuery({
    ...workOrderQueries.detail(workOrderId),
    enabled: isId,
  });

  /** Data */

  const workOrderData = isId ? workOrderQuery.data : workOrder;
  const workOrderLabel = workOrderData ? workOrderData.label : "Work Order";

  /** Mutations */

  const deleteWorkOrderMutation = useMutation(workOrderMutations.delete());

  /** Callbacks */

  const handleDeleteWorkOrder = () => {
    deleteWorkOrderMutation.mutate(workOrderId, {
      onSuccess: () => {
        queryClient.invalidateQueries(workOrderQueries.list());
        navigate({ to: "/app/dashboard/work-orders" });
      },
    });
  };

  /** Options */

  const options: MenuOption<
    "detail" | "edit" | "createWorkOrder" | "delete"
  >[] = [
    {
      id: "detail",
      label: "Detail",
      Icon: Info,
      onClick: () =>
        navigate({
          to: "/app/dashboard/work-orders/$id",
          params: { id: String(workOrderId) },
        }),
    },
    {
      id: "edit",
      label: "Edit",
      Icon: Edit,
      onClick: () =>
        navigate({
          to: "/app/dashboard/work-orders/$id",
          params: { id: String(workOrderId) },
          search: { edit: true },
        }),
    },
    {
      id: "delete",
      label: "Delete",
      Icon: Delete,
      color: "error",
      onClick: () =>
        confirm(`Delete ${workOrderLabel}?`, handleDeleteWorkOrder),
    },
  ];

  return { workOrder: workOrderData, options };
};

export default useWorkOrder;
