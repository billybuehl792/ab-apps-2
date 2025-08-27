import { createContext } from "react";
import type { ConfirmOptions } from "@/components/modals/ConfirmDialog";

export default createContext<
  (
    options: ConfirmOptions | string,
    callback?: VoidFunction
  ) => Promise<boolean>
>(() => {
  return Promise.resolve(true);
});
