import {
  createContext,
  type ReactNode,
  type ReactEventHandler,
  type SyntheticEvent,
} from "react";

export default createContext<{
  open: <TOptions extends MenuOption[] = MenuOption[]>(
    options: {
      title?: ReactNode;
      options: TOptions;
      variant?: "menu" | "drawer";
      disableCloseOnSelect?: boolean;
      onSelect?: (
        option: TOptions[number],
        event: SyntheticEvent<HTMLElement>,
      ) => void;
      onClose?: ReactEventHandler;
    },
    event: React.MouseEvent<HTMLElement> | undefined,
  ) => void;
  close: ReactEventHandler;
}>({
  open: () => null,
  close: () => null,
});
