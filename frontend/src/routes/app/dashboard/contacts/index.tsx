import { useMemo } from "react";
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { useQuery } from "@tanstack/react-query";
import z from "zod";
import { Add } from "@mui/icons-material";
import StatusWrapper from "@/components/layout/StatusWrapper";
import ButtonLink from "@/components/links/ButtonLink";
import ContactList from "@/containers/lists/ContactList";
import { contactEndpoints } from "@/store/constants/contacts";
import { contactListRequestSchema } from "@/store/schemas/contacts";
import { EObjectChangeType } from "@/store/enums/api";
import type { TRouteLoaderData } from "@/store/types/router";

const paramsSchema = contactListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/dashboard/contacts/")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  pendingComponent: () => <StatusWrapper loading my={2} />,
  errorComponent: ({ error }) => <StatusWrapper error={error} my={2} />,
  component: RouteComponent,
  loader: (): TRouteLoaderData => ({
    slotProps: {
      pageHeader: {
        endContent: (
          <ButtonLink
            children="Create"
            to="/app/dashboard/contacts/create"
            startIcon={<Add />}
          />
        ),
      },
    },
  }),
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Queries */

  const contactListQuery = useQuery({
    queryKey: [contactEndpoints.id, { params }],
    queryFn: () => contactEndpoints.get({ params }),
  });

  /** Data */

  const total = useMemo(
    () => contactListQuery.data?.count ?? false,
    [contactListQuery.data],
  );

  /** Callbacks */

  const handleOnParamsChange = (
    newParams: z.input<typeof contactListRequestSchema.shape.params>,
  ) =>
    navigate({
      to: "/app/dashboard/contacts",
      search: contactListRequestSchema.shape.params.parse({
        ...params,
        ...newParams,
      }),
      replace: true,
    });

  const handleOnCardChange: IContactListProps["onCardChange"] = (
    contact,
    type,
  ) => {
    if (type === EObjectChangeType.Delete) {
      const isLastItemOnPage =
        contactListQuery.data?.results.at(-1)?.id === contact.id;
      const isFirstPage = params.page === 1;
      if (isLastItemOnPage && !isFirstPage)
        handleOnParamsChange({ page: params.page - 1 });
      else contactListQuery.refetch();
    }
  };

  return (
    <ContactList
      items={contactListQuery.data?.results ?? []}
      total={total}
      options={{ params }}
      loading={contactListQuery.isLoading}
      error={contactListQuery.error}
      renderSkeletonItem
      mb={2}
      onCardChange={handleOnCardChange}
      onPageChange={(_event, page) => handleOnParamsChange({ page })}
      onSearchChange={(value) =>
        handleOnParamsChange({ search: value, page: 1 })
      }
      onOrderingChange={(value) =>
        handleOnParamsChange({ ordering: value, page: 1 })
      }
      onFiltersChange={(value) =>
        handleOnParamsChange({
          city: value.city,
          work_order_status: value.workOrderStatus,
        })
      }
      slotProps={{
        header: {
          position: "sticky",
          top: (theme) => theme.layout.page.header.height,
          bgcolor: "background.paper",
          zIndex: 1,
        },
      }}
    />
  );
}
