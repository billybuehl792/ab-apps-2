import {
  AccountCircle,
  ManageAccounts,
  PeopleOutline,
  PersonOutline,
} from "@mui/icons-material";
import { EUserListOrdering } from "../enums/account";

/** Icons */

export const AccountIcons = {
  Detail: AccountCircle,
  Settings: ManageAccounts,
  users: {
    Detail: PersonOutline,
    List: PeopleOutline,
  },
};

/** Other */

export const userListOrderingOptions: TOrderingOption<EUserListOrdering>[] = [
  {
    id: "created_at",
    label: "Created",
    value: {
      asc: EUserListOrdering.CreatedAtAsc,
      desc: EUserListOrdering.CreatedAtDesc,
    },
  },
  {
    id: "updated_at",
    label: "Updated",
    value: {
      asc: EUserListOrdering.UpdatedAtAsc,
      desc: EUserListOrdering.UpdatedAtDesc,
    },
  },
  {
    id: "first_name",
    label: "First Name",
    value: {
      asc: EUserListOrdering.FirstNameAsc,
      desc: EUserListOrdering.FirstNameDesc,
    },
  },
  {
    id: "last_name",
    label: "Last Name",
    value: {
      asc: EUserListOrdering.LastNameAsc,
      desc: EUserListOrdering.LastNameDesc,
    },
  },
];
