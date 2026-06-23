import { AddLocationAlt, Map, Place } from "@mui/icons-material";
import { EPlaceListOrdering } from "../enums/places";

/** Icons */

export const PlaceIcons = {
  List: Map,
  Detail: Place,
  Create: AddLocationAlt,
};

/** Other */

export const placeListOrderingOptions: TOrderingOption<EPlaceListOrdering>[] = [
  {
    id: "city",
    label: "City",
    value: {
      asc: EPlaceListOrdering.CityAsc,
      desc: EPlaceListOrdering.CityDesc,
    },
  },
  {
    id: "created",
    label: "Created",
    value: {
      asc: EPlaceListOrdering.CreatedAtAsc,
      desc: EPlaceListOrdering.CreatedAtDesc,
    },
  },
  {
    id: "updated",
    label: "Updated",
    value: {
      asc: EPlaceListOrdering.UpdatedAtAsc,
      desc: EPlaceListOrdering.UpdatedAtDesc,
    },
  },
];
