import { createContext } from "react";
import type { IConfirmOptions } from "@/components/modals/ConfirmDialog";

export default createContext<
  (
    options: IConfirmOptions | string,
    callback?: VoidFunction,
  ) => Promise<boolean>
>(() => {
  return Promise.resolve(true);
});
