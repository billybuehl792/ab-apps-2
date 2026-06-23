import { People, Person, PersonAdd } from "@mui/icons-material";
import { EContactListOrdering } from "../enums/contacts";

/** Icons */

export const ContactIcons = {
  List: People,
  Detail: Person,
  Create: PersonAdd,
};

/** Other */

export const contactListOrderingOptions: TOrderingOption<EContactListOrdering>[] =
  [
    {
      id: "first_name",
      label: "First Name",
      value: {
        asc: EContactListOrdering.FirstNameAsc,
        desc: EContactListOrdering.FirstNameDesc,
      },
    },
    {
      id: "last_name",
      label: "Last Name",
      value: {
        asc: EContactListOrdering.LastNameAsc,
        desc: EContactListOrdering.LastNameDesc,
      },
    },
    {
      id: "created_at",
      label: "Created",
      value: {
        asc: EContactListOrdering.CreatedAtAsc,
        desc: EContactListOrdering.CreatedAtDesc,
      },
    },
    {
      id: "updated_at",
      label: "Updated",
      value: {
        asc: EContactListOrdering.UpdatedAtAsc,
        desc: EContactListOrdering.UpdatedAtDesc,
      },
    },
  ];
