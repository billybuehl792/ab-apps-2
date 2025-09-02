export type ApiListRequestBase<O extends string = string> = {
  ordering?: O;
  page_size?: number;
  page?: number;
  search?: string;
};

export type ApiListRequestFilters<T extends string = string> = {
  [key in T]?: string | number | boolean | null | undefined;
};

export type ApiListRequest<
  O extends string = string,
  F extends string = string,
> = ApiListRequestBase<O> & ApiListRequestFilters<F>;

export interface ApiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
