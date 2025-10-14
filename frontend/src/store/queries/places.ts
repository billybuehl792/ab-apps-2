import { queryOptions } from "@tanstack/react-query";
import { placeApi } from "../api/places";
import { queryUtils } from "../utils/queries";
import { paramUtils } from "../utils/params";
import {
  defaultGoogleAutocompleteFields,
  defaultGoogleAutocompleteOptions,
  defaultGooglePlaceFields,
} from "../constants/places";
import type {
  GooglePlacesAutocompleteResponse,
  GooglePlacesPlace,
  PlaceListRequestParams,
} from "../types/places";

const detail = (id: number) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["places", "detail"], { id }),
    enabled: Boolean(id),
    queryFn: ({ queryKey: [_, { id }] }) => placeApi.detail(id),
  });

const list = (params?: PlaceListRequestParams) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(
      ["places", "list"],
      paramUtils.cleanListRequestParamsParams<PlaceListRequestParams>(params)
    ),
    queryFn: ({ queryKey: [_, params] }) =>
      placeApi.list(params).then((res) => res.data),
  });

/** Other */

const cities = () =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["places", "cities"]),
    queryFn: () => placeApi.cities().then((res) => res.data),
  });

/** Google */

const googlePlace = (id: string) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["places", "googlePlace"], {
      id,
    }),
    enabled: Boolean(id),
    queryFn: ({ queryKey: [_, { id }] }) =>
      placeApi.googlePlace(id).then((res) => res.data),
  });

const googleAutocompleteSuggestions = (input: string, sessionToken?: string) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(
      ["places", "googleAutocompleteSuggestions"],
      {
        input,
        sessionToken,
      }
    ),
    enabled: Boolean(input),
    queryFn: ({ queryKey: [_, { input, sessionToken }] }) =>
      placeApi
        .googleAutocompleteSuggestions(input, sessionToken)
        .then((res) => res.data),
  });

/** Google Maps Places API */

const googlePlacesPlaceDetail = (placeId: string) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["places", "google-places-place-detail"], {
      placeId,
    }),
    enabled: Boolean(placeId),
    retry: false,
    queryFn: async ({ queryKey: [_, { placeId }] }) => {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          headers: {
            "X-Goog-Api-Key": import.meta.env
              .VITE_GOOGLE_MAPS_API_KEY as string,
            "X-Goog-FieldMask": defaultGooglePlaceFields.join(","),
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch place details");

      return (await res.json()) as GooglePlacesPlace;
    },
  });

const googlePlacesAutocompleteSuggestionList = (
  input: string,
  sessionToken?: string
) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(
      ["places", "google-places-autocomplete-suggestion-list"],
      {
        input,
        sessionToken,
      }
    ),
    enabled: Boolean(input),
    retry: false,
    queryFn: async ({ queryKey: [_, { input, sessionToken }] }) => {
      const res = await fetch(
        `https://places.googleapis.com/v1/places:autocomplete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": import.meta.env
              .VITE_GOOGLE_MAPS_API_KEY as string,
            "X-Goog-FieldMask": defaultGoogleAutocompleteFields.join(","),
          },
          body: JSON.stringify({
            ...defaultGoogleAutocompleteOptions,
            input,
            sessionToken,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch place details");
      return (await res.json()) as GooglePlacesAutocompleteResponse;
    },
  });

export const placeQueries = {
  detail,
  list,
  // Other
  cities,
  // Google
  googlePlace,
  googleAutocompleteSuggestions,
  // Google Maps Places API
  googlePlacesPlaceDetail,
  googlePlacesAutocompleteSuggestionList,
};
