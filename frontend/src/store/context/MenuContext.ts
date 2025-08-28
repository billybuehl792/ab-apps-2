import { createContext } from "react";
import type { MenuOptions } from "@/components/modals/MenuOptionModal";

export default createContext<{
  open: (options: MenuOptions, event?: React.MouseEvent<HTMLElement>) => void;
  close: VoidFunction;
}>({
  open: () => null,
  close: () => null,
});
