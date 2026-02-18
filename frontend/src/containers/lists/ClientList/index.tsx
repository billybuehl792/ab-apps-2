import { type ComponentProps } from "react";
import { Add } from "@mui/icons-material";
import PaginatedList, {
  type IPaginatedListProps,
} from "@/components/lists/PaginatedList";
import OrderingButtonGroup, {
  type IOrderingButtonGroupProps,
} from "@/components/buttons/OrderingButtonGroup";
import CustomLink from "@/components/links/CustomLink";
import ClientListCard from "./components/cards/ClientListCard";
import {
  ClientIcons,
  clientListOrderingOptions,
} from "@/store/constants/clients";
import type { TClient, TClientListRequest } from "@/store/types/clients";

type TPaginatedListProps = IPaginatedListProps<
  TClient,
  TClientListRequest["params"]
>;
type TOrderingButtonGroupProps = IOrderingButtonGroupProps<
  typeof clientListOrderingOptions
>;
type TCardProps = Partial<
  Omit<ComponentProps<typeof ClientListCard>, "client">
>;

interface IClientListProps extends Omit<
  TPaginatedListProps,
  "params" | "renderItem" | "onChange" | "slotProps"
> {
  options: TClientListRequest;
  onOrderingChange?: TOrderingButtonGroupProps["onChange"];
  onChange?: TCardProps["onChange"];
  slotProps?: {
    card?: TCardProps | ((client: TClient) => TCardProps);
    orderingButtonGroup?: Partial<TOrderingButtonGroupProps>;
  } & TPaginatedListProps["slotProps"];
}

const ClientList: React.FC<IClientListProps> = ({
  options,
  total,
  loading,
  error,
  empty,
  onOrderingChange,
  onChange,
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
          onChange={onChange}
          {...(typeof cardProps === "function" ? cardProps(client) : cardProps)}
        />
      )}
      renderSkeletonItem
      slotProps={{
        ...slotProps,
        header: {
          ...(!!onOrderingChange && {
            endContent: (
              <OrderingButtonGroup
                options={clientListOrderingOptions}
                size="small"
                value={options.params.ordering}
                onChange={onOrderingChange}
                width={160}
                {...slotProps?.orderingButtonGroup}
              />
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
