import { type ContextType, useState, type PropsWithChildren } from "react";
import ConfirmContext from "@/store/context/ConfirmContext";
import ConfirmDialog, {
  type ConfirmOptions,
} from "@/components/modals/ConfirmDialog";

const ConfirmProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [callback, setCallback] = useState<VoidFunction | null>(null);
  const [resolver, setResolver] = useState<((result: boolean) => void) | null>(
    null
  );

  /** Callbacks */

  const handleConfirmOpen: ContextType<typeof ConfirmContext> = (
    options,
    callback
  ) => {
    setOptions(typeof options === "string" ? { title: options } : options);
    setCallback(() => callback ?? null);
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleResolveConfirm = (result: boolean) => {
    if (resolver) resolver(result);
    if (result) callback?.();
    setOpen(false);
  };

  const handleResetState = () => {
    setResolver(null);
    setCallback(null);
    setOptions(null);
  };

  return (
    <ConfirmContext value={handleConfirmOpen}>
      {children}
      <ConfirmDialog
        open={open}
        {...options}
        onConfirm={() => handleResolveConfirm(true)}
        onClose={() => handleResolveConfirm(false)}
        onTransitionExited={handleResetState}
      />
    </ConfirmContext>
  );
};

export default ConfirmProvider;
