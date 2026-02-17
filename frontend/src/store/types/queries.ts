export type TQueryKey<O extends object | undefined = undefined> =
  O extends undefined ? [ReadonlyArray<string>] : [ReadonlyArray<string>, O];
