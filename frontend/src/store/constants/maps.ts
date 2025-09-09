export const DEFAULT_LAT_LNG = { latitude: 41.2303, longitude: -81.4806 }; // Default coordinates for Twinsburg, OH

export const DEFAULT_PLACE_FIELDS = [
  "id",
  "formattedAddress",
  "shortFormattedAddress",
  "postalAddress",
  "location",
];

export const DEFAULT_AUTOCOMPLETE_FIELDS = [
  "suggestions.placePrediction.placeId",
  "suggestions.placePrediction.structuredFormat",
  "suggestions.placePrediction.text.text",
  "suggestions.placePrediction.text.matches",
];

export const DEFAULT_AUTOCOMPLETE_OPTIONS = {
  origin: DEFAULT_LAT_LNG,
  locationRestriction: {
    rectangle: {
      low: {
        latitude: DEFAULT_LAT_LNG.latitude - 0.5,
        longitude: DEFAULT_LAT_LNG.longitude - 0.5,
      },
      high: {
        latitude: DEFAULT_LAT_LNG.latitude + 0.5,
        longitude: DEFAULT_LAT_LNG.longitude + 0.5,
      },
    },
  },
  includedPrimaryTypes: ["street_address"],
  languageCode: "en-US",
  regionCode: "us",
};
