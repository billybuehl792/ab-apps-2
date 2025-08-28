import { type ContextType, useState, type PropsWithChildren } from "react";
import MenuContext from "@/store/context/MenuContext";
import MenuOptionModal, {
  type MenuOptions,
} from "@/components/modals/MenuOptionModal";

const MenuProvider = ({ children }: PropsWithChildren) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement | true>(null);
  const [options, setOptions] = useState<MenuOptions | null>(null);

  /** Callbacks */

  const handleOpen: ContextType<typeof MenuContext>["open"] = (
    options,
    event
  ) => {
    setOptions(options);
    setAnchorEl(event ? event.currentTarget : true);
  };

  const handleClose: ContextType<typeof MenuContext>["close"] = () =>
    setAnchorEl(null);

  const handleResetState = () => setOptions(null);

  return (
    <MenuContext value={{ open: handleOpen, close: handleClose }}>
      {children}
      <MenuOptionModal
        open={Boolean(anchorEl)}
        anchorEl={anchorEl === true ? undefined : anchorEl}
        {...options}
        options={options?.options ?? []}
        onClose={handleClose}
        onTransitionExited={handleResetState}
      />
    </MenuContext>
  );
};

export default MenuProvider;
