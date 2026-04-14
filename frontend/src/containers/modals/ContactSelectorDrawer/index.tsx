import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mui/material";
import Drawer, { type IDrawerProps } from "@/components/modals/Drawer";
import { contactEndpoints } from "@/store/constants/contacts";
import type { TContact } from "@/store/types/contacts";

type TId = TContact["id"];

interface IContactSelectorDrawerProps<
  TMultiple extends boolean = false,
> extends Omit<IDrawerProps, "disabled" | "onChange"> {
  value?: TMultiple extends true ? TId[] : TId | null;
  multiple?: TMultiple;
  loading?: boolean;
  disabled?: boolean;
  options?: TContact[];
  onChange?: (value: TMultiple extends true ? TId[] : TId | null) => void;
  onCreate?: (contact: TContact) => void;
}

const ContactSelectorDrawer = <TMultiple extends boolean = false>({
  value,
  multiple,
  loading,
  disabled,
  onChange,
  onCreate,
  ...props
}: IContactSelectorDrawerProps<TMultiple>) => {
  /** Queries */

  const contactListQuery = useQuery({
    queryKey: [contactEndpoints.id, { params }],
    queryFn: () => contactEndpoints.get({ params }),
  });

  return (
    <Drawer {...props}>
      <Stack></Stack>
    </Drawer>
  );
};

export default ContactSelectorDrawer;
