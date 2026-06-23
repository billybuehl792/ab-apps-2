import api from "../config/api";
import type {
  TGoogleAutocompleteSuggestionListRequest,
  TGoogleAutocompleteSuggestionListResponse,
  TGooglePlace,
  TPlace,
  TPlaceListRequest,
  TPlaceListResponse,
  TCityListRequest,
  TCityListResponse,
} from "../types/places";

const placeEndpoints = {
  id: ["places"] as const,
  url: "/places/",
  get: (options?: TPlaceListRequest) =>
    api
      .get<TPlaceListResponse>(placeEndpoints.url, options)
      .then((res) => res.data),
  place: (id: TPlace["id"]) => ({
    id: [...placeEndpoints.id, "place", id] as const,
    url: `${placeEndpoints.url}${id}/`,
    get: () =>
      api.get<TPlace>(placeEndpoints.place(id).url).then((res) => res.data),
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
  googlePlace: (id: string) => ({
    id: [...placeEndpoints.id, "google-place", id] as const,
    url: `${placeEndpoints.url}google-place/${id}/`,
    get: () =>
      api
        .get<TGooglePlace>(placeEndpoints.googlePlace(id).url)
        .then((res) => res.data),
  }),
  cities: () => ({
    id: [...placeEndpoints.id, "cities"] as const,
    url: `${placeEndpoints.url}cities/`,
    get: (options?: TCityListRequest) =>
      api
        .get<TCityListResponse>(placeEndpoints.cities().url, options)
        .then((res) => res.data),
  }),
};

export default placeEndpoints;
