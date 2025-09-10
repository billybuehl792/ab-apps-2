import { type ComponentProps, useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Chip, type ChipProps } from "@mui/material";
import { Edit, Person, PersonOff } from "@mui/icons-material";
import { workOrderMutations } from "@/store/mutations/work-orders";
import useMenu from "@/store/hooks/useMenu";
import useConfirm from "@/store/hooks/useConfirm";
import WorkOrderClientFormDrawer from "@/containers/modals/WorkOrderClientFormDrawer";
import ClientChip from "../ClientChip";
import type { WorkOrder } from "@/store/types/work-orders";

interface WorkOrderClientFormChipProps extends ChipProps {
  workOrder: WorkOrder;
}

const WorkOrderClientFormChip = ({
  workOrder,
  ...props
}: WorkOrderClientFormChipProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  /** Values */

  const router = useRouter();
  const navigate = useNavigate();
  const menu = useMenu();
  const confirm = useConfirm();

  const title = "Work Order Client";
  const clientName = workOrder.client
    ? `${workOrder.client.first_name} ${workOrder.client.last_name}`
    : "Client";

  /** Mutations */

  const updateWorkOrderMutation = useMutation(workOrderMutations.update());

  /** Callbacks */

  const handleOpenClientMenu: ComponentProps<typeof ClientChip>["onClick"] = (
    event
  ) => {
    if (!workOrder.client) return;
    menu.open(
      {
        title,
        options: [
          {
            id: "client",
            label: clientName,
            icon: <Person />,
            onClick: handleNavigateClient,
          },
          {
            id: "edit",
            label: "Edit",
            icon: <Edit />,
            onClick: () => setModalOpen(true),
          },
          {
            id: "unassign",
            label: "Unassign",
            icon: <PersonOff />,
            color: "error",
            onClick: handleUnassign,
          },
        ],
      },
      event
    );
  };

  const handleNavigateClient = () => {
    if (!workOrder.client) return;
    navigate({
      to: "/app/clients/$id",
      params: { id: String(workOrder.client.id) },
    });
  };

  const handleAssign: ComponentProps<
    typeof WorkOrderClientFormDrawer
  >["form"]["onSubmit"] = (data) =>
    updateWorkOrderMutation.mutateAsync(
      { id: workOrder.id, client: data.client?.id ?? null },
      { onSuccess: handleAssignToggleSuccess }
    );

  const handleUnassign = () => {
    if (!workOrder.client) return;
    confirm(`Unassign ${clientName}`, () => handleAssign({ client: null }));
  };

  const handleAssignToggleSuccess = () => {
    setModalOpen(false);
    router.invalidate();
  };

  return (
    <>
      {workOrder.client ? (
        <ClientChip
          client={workOrder.client}
          onClick={handleOpenClientMenu}
          {...props}
        />
      ) : (
        <Chip
          label="None"
          color="disabled"
          onClick={() => setModalOpen(true)}
          {...props}
        />
      )}
      <WorkOrderClientFormDrawer
        open={modalOpen}
        form={{
          values: { client: workOrder.client },
          onSubmit: handleAssign,
        }}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default WorkOrderClientFormChip;
