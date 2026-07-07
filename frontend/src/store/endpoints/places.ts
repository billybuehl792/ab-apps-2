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

export const placeEndpoints = {
  get: (body?: TPlaceListRequest) =>
    api.get<TPlaceListResponse>("/places/", body).then((res) => res.data),
  place: (id: TPlace["id"]) => ({
    get: () => api.get<TPlace>(`/places/${id}/`).then((res) => res.data),
    delete: () => api.delete<void>(`/places/${id}/`).then((res) => res.data),
  }),
  googleAutocompleteSuggestions: {
    get: (body: TGoogleAutocompleteSuggestionListRequest) =>
      api
        .get<TGoogleAutocompleteSuggestionListResponse>(
          "/places/google-autocomplete-suggestions/",
          body,
        )
        .then((res) => res.data),
  },
  googlePlace: (id: TGooglePlace["id"]) => ({
    get: () =>
      api
        .get<TGooglePlace>(`/places/google-place/${id}/`)
        .then((res) => res.data),
  }),
  cities: {
    get: (body?: TCityListRequest) =>
      api
        .get<TCityListResponse>("/places/cities/", body)
        .then((res) => res.data),
  },
};
