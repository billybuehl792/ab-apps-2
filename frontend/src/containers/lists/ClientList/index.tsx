import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Pagination,
  type PaginationProps,
  Skeleton,
  Stack,
  type StackProps,
} from "@mui/material";
import { clientQueries } from "@/store/queries/clients";
import Link from "@/components/elements/Link";
import StatusCard from "@/components/cards/StatusCard";
import ClientListCard from "@/containers/cards/ClientListCard";

interface ClientListProps extends StackProps {
  params?: Parameters<typeof clientQueries.list>[0];
  onPageChange: (page: number) => void;
}

const DEFAULT_PAGE_SIZE = 20;

const ClientList = ({ params, onPageChange, ...props }: ClientListProps) => {
  const [pageCount, setPageCount] = useState(0);

  /** Values */

  const pageSize = params?.page_size ?? DEFAULT_PAGE_SIZE;

  /** Queries */

  const clientListQuery = useQuery(clientQueries.list(params));

  /** Callbacks */

  const handlePageChange: PaginationProps["onChange"] = (_event, value) =>
    onPageChange(value);

  /** Effects */

  useEffect(() => {
    if (clientListQuery.data)
      setPageCount(Math.ceil(clientListQuery.data.count / pageSize));
  }, [clientListQuery.data, pageSize]);

  return (
    <Stack spacing={1} {...props}>
      {clientListQuery.isLoading ? (
        Array.from({ length: pageSize }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={84} />
        ))
      ) : clientListQuery.isSuccess && clientListQuery.data.count ? (
        clientListQuery.data.results.map((client) => (
          <ClientListCard key={client.id} client={client} />
        ))
      ) : (
        <StatusCard
          error={clientListQuery.error}
          {...(clientListQuery.data?.count === 0 && {
            empty: "No Clients",
            label: <Link label="Create Client" to="/app/clients/create" />,
          })}
        />
      )}
      {pageCount > 1 && (
        <Stack direction="row" justifyContent="center">
          <Pagination
            count={pageCount}
            {...(pageCount > 10 && {
              showFirstButton: true,
              showLastButton: true,
            })}
            disabled={clientListQuery.isLoading}
            page={params?.page ?? 1}
            onChange={handlePageChange}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default ClientList;
