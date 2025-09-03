export type QueryKey<O extends object | undefined = undefined> =
  O extends undefined ? [ReadonlyArray<string>] : [ReadonlyArray<string>, O];
