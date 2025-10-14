export type ListRequestParams<O extends string = string> = {
  ordering?: O | null;
  page_size?: number;
  page?: number;
  search?: string;
};

export interface ListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
