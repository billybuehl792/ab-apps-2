import type { QueryKey } from "../types/queries";

const getQueryKey = <O extends object | undefined = undefined>(
  id: ReadonlyArray<string>,
  options?: O
) => {
  return (
    options instanceof Object
      ? ([id, options] as QueryKey<O>)
      : ([id] as QueryKey)
  ) as O extends object ? QueryKey<O> : QueryKey;
};

/**
 * A helper function that simulates a delay using a Promise.
 * @param ms - delay in milliseconds
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const queryUtils = {
  getQueryKey,
  delay,
};
