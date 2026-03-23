import { AddLocationAlt, Map, Place } from "@mui/icons-material";
import api from "../config/api";
import type {
  TGoogleAutocompleteSuggestionListRequest,
  TGoogleAutocompleteSuggestionListResponse,
  TPlace,
  TPlaceCreate,
  TPlaceListRequest,
  TPlaceListResponse,
  TPlaceUpdate,
} from "../types/places";
import { EPlaceListOrdering } from "../enums/places";

/** Icons */

export const PlaceIcons = {
  List: Map,
  Detail: Place,
  Create: AddLocationAlt,
};

/** API */

export const placeEndpoints = {
  id: ["places"] as const,
  url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/places/`,
  get: (options?: TPlaceListRequest) =>
    api
      .get<TPlaceListResponse>(placeEndpoints.url, options)
      .then((res) => res.data),
  post: (body: TPlaceCreate) =>
    api.post<TPlace>(placeEndpoints.url, body).then((res) => res.data),
  place: (id: TPlace["id"]) => ({
    id: [...placeEndpoints.id, "place", id] as const,
    url: `${placeEndpoints.url}${id}/`,
    get: () =>
      api.get<TPlace>(placeEndpoints.place(id).url).then((res) => res.data),
    patch: (body: TPlaceUpdate) =>
      api
        .patch<TPlace>(placeEndpoints.place(id).url, body)
        .then((res) => res.data),
    delete: () =>
      api.delete<void>(placeEndpoints.place(id).url).then((res) => res.data),
  }),
  googleAutocompleteSuggestions: () => ({
    id: [...placeEndpoints.id, "google-autocomplete-suggestions"] as const,
    url: `${placeEndpoints.url}google-autocomplete-suggestions/`,
    get: (options: TGoogleAutocompleteSuggestionListRequest) =>
      api
        .get<TGoogleAutocompleteSuggestionListResponse>(
          placeEndpoints.googleAutocompleteSuggestions().url,
          options,
        )
        .then((res) => res.data),
  }),
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

export const getPlaceholderPlace = (
  data: TWithRequired<Partial<TPlace>, "id">,
): TPlace => ({
  google_place_id: "",
  address_full: "",
  address_short: "",
  city: "",
  postal_code: "",
  state: "",
  country: "",
  latitude: 0,
  longitude: 0,
  created_at: "",
  updated_at: "",
  ...data,
});
