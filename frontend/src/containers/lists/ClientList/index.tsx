import { type ComponentProps } from "react";
import { Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import PaginatedList, {
  type IPaginatedListProps,
} from "@/components/lists/PaginatedList";
import CustomLink from "@/components/links/CustomLink";
import ClientListCard from "./components/cards/ClientListCard";
import ClientListOrderingButtonGroup, {
  type IClientListOrderingButtonGroupProps,
} from "./components/buttons/ClientListOrderingButtonGroup";
import ClientListFiltersIconButton, {
  type IClientListFiltersIconButtonProps,
} from "./components/buttons/ClientListFiltersIconButton";
import { ClientIcons } from "@/store/constants/clients";
import type { TClient, TClientListRequest } from "@/store/types/clients";

type TPaginatedListProps = IPaginatedListProps<
  TClient,
  TClientListRequest["params"]
>;
type TCardProps = Partial<
  Omit<ComponentProps<typeof ClientListCard>, "client">
>;

export interface IClientListProps extends Omit<
  TPaginatedListProps,
  "params" | "renderItem" | "onChange" | "slotProps"
> {
  options: TClientListRequest;
  onOrderingChange?: IClientListOrderingButtonGroupProps["onChange"];
  onFiltersChange?: IClientListFiltersIconButtonProps["form"]["onSubmit"];
  onCardChange?: TCardProps["onChange"];
  slotProps?: {
    card?: TCardProps | ((client: TClient) => TCardProps);
    orderingButtonGroup?: Partial<IClientListOrderingButtonGroupProps>;
    filtersIconButton?: Partial<IClientListFiltersIconButtonProps>;
  } & TPaginatedListProps["slotProps"];
}

const ClientList: React.FC<IClientListProps> = ({
  options,
  total,
  loading,
  error,
  empty,
  onOrderingChange,
  onFiltersChange,
  onCardChange,
  slotProps: { card: cardProps, ...slotProps } = {},
  ...props
}) => {
  return (
    <PaginatedList
      total={total}
      params={options.params}
      loading={loading}
      error={error}
      empty={
        total === 0 || empty === true
          ? {
              label: "No Clients Found",
              icon: <ClientIcons.List fontSize="large" />,
              ...(options.params.search
                ? { description: `No results for "${options.params.search}".` }
                : {
                    actions: [
                      <CustomLink
                        label="Create"
                        to="/app/dashboard/clients/create"
                        icon={<Add />}
                      />,
                    ],
                  }),
            }
          : empty
      }
      renderItem={(client) => (
        <ClientListCard
          key={client.id}
          client={client}
          onChange={onCardChange}
          {...(typeof cardProps === "function" ? cardProps(client) : cardProps)}
        />
      )}
      renderSkeletonItem
      slotProps={{
        ...slotProps,
        header: {
          ...((!!onOrderingChange || !!onFiltersChange) && {
            endContent: (
              <Stack direction="row" spacing={1}>
                {!!onOrderingChange && (
                  <ClientListOrderingButtonGroup
                    value={options.params.ordering}
                    onChange={onOrderingChange}
                    {...slotProps?.orderingButtonGroup}
                  />
                )}
                {!!onFiltersChange && (
                  <ClientListFiltersIconButton
                    form={{
                      values: {
                        city: options.params.city ?? [],
                        workOrderStatus: options.params.work_order_status ?? [],
                      },
                      onSubmit: onFiltersChange,
                    }}
                    {...slotProps?.filtersIconButton}
                  />
                )}
              </Stack>
            ),
          }),
          ...slotProps?.header,
        },
      }}
      {...props}
    />
  );
};

export default ClientList;
