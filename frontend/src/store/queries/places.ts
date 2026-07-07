import { queryOptions } from "@tanstack/react-query";
import { placeEndpoints } from "../endpoints/places";
import type {
  TCityListRequest,
  TGoogleAutocompleteSuggestionListRequest,
  TGooglePlace,
  TPlace,
  TPlaceListRequest,
} from "../types/places";

export const placeQueries = {
  list: (body?: TPlaceListRequest) =>
    queryOptions({
      queryKey: ["places", "list", body],
      queryFn: () => placeEndpoints.get(body),
    }),
  place: (id: TPlace["id"]) => ({
    detail: queryOptions({
      queryKey: ["places", "place", id],
      queryFn: placeEndpoints.place(id).get,
    }),
  }),
  googleAutocompleteSuggestions: {
    list: (body: TGoogleAutocompleteSuggestionListRequest) =>
      queryOptions({
        queryKey: ["places", "googleAutocompleteSuggestions", body],
        queryFn: () => placeEndpoints.googleAutocompleteSuggestions.get(body),
      }),
  },
  googlePlace: (id: TGooglePlace["id"]) => ({
    detail: queryOptions({
      queryKey: ["places", "googlePlace", id],
      queryFn: placeEndpoints.googlePlace(id).get,
    }),
  }),
  cities: {
    list: (body?: TCityListRequest) =>
      queryOptions({
        queryKey: ["places", "cities", body],
        queryFn: () => placeEndpoints.cities.get(body),
      }),
  },
};
