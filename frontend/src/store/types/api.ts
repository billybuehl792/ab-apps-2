type ApiListRequestFilters<T extends string = string> = {
  [key in T]?: string | number | boolean | null | undefined;
};

export type ApiListRequest<
  O extends string = string,
  F extends string = string,
> = ApiListRequestFilters<F> & {
  ordering?: O;
  page_size?: number;
  page?: number;
  search?: string;
};

export interface ApiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
