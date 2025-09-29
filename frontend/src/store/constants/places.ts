import { AddLocationAlt, Map, Place } from "@mui/icons-material";

/** Icons */

export const PlaceIcons = {
  List: Map,
  Detail: Place,
  Create: AddLocationAlt,
};

/** API */

export const placeEndpoints = {
  places: Object.assign(
    () => `${import.meta.env.VITE_BACKEND_BASE_URL}/api/places/`,
    {
      detail: (id: number) => `${placeEndpoints.places()}${id}/`,
      count: () => `${placeEndpoints.places()}count/`,
      cities: () => `${placeEndpoints.places()}cities/`,
      googlePlace: () => `${placeEndpoints.places()}google-place/`,
      googleAutocompleteSuggestions: () =>
        `${placeEndpoints.places()}google-autocomplete-suggestions/`,
    }
  ),
};

/** Google Places API */

export const defaultLatLng = { latitude: 41.2303, longitude: -81.4806 }; // Default coordinates for Twinsburg, OH

export const defaultGooglePlaceFields = [
  "id",
  "formattedAddress",
  "shortFormattedAddress",
  "postalAddress",
  "location",
];

export const defaultGoogleAutocompleteFields = [
  "suggestions.placePrediction.placeId",
  "suggestions.placePrediction.structuredFormat",
  "suggestions.placePrediction.text.text",
  "suggestions.placePrediction.text.matches",
];

export const defaultGoogleAutocompleteOptions = {
  origin: defaultLatLng,
  locationRestriction: {
    rectangle: {
      low: {
        latitude: defaultLatLng.latitude - 0.5,
        longitude: defaultLatLng.longitude - 0.5,
      },
      high: {
        latitude: defaultLatLng.latitude + 0.5,
        longitude: defaultLatLng.longitude + 0.5,
      },
    },
  },
  includedPrimaryTypes: ["street_address"],
  languageCode: "en-US",
  regionCode: "us",
};
