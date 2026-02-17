import { z } from "zod";

export const placeSchema = z.object({
  id: z.number().positive(),
  google_place_id: z.string().describe("Google Places API place ID"),
  address_full: z.string(),
  address_short: z.string(),
  city: z.string(),
  postal_code: z.string(),
  state: z.string(),
  country: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const placeBasicSchema = z.object({
  id: z.number().positive(),
  google_place_id: z.string().describe("Google Places API place ID"),
  address_short: z.string(),
  city: z.string(),
  state: z.string(),
});

export const placeWriteableSchema = z.object({
  id: z.number(),
  google_place_id: z.string(),
});

// Google Places API schemas
export const googlePlacesPlaceSchema = z.object({
  id: z.string(),
  formattedAddress: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  shortFormattedAddress: z.string(),
  postalAddress: z.object({
    regionCode: z.string(),
    languageCode: z.string(),
    postalCode: z.string(),
    administrativeArea: z.string(),
    locality: z.string(),
    addressLines: z.array(z.string()),
  }),
});

export const googlePlacesPlacePredictionSchema = z.object({
  placeId: z.string(),
  text: z.object({
    text: z.string(),
    matches: z.array(z.object({ endOffset: z.number() })),
  }),
  structuredFormat: z.object({
    mainText: z.object({
      text: z.string(),
      matches: z.array(z.object({ endOffset: z.number() })),
    }),
    secondaryText: z.object({ text: z.string() }),
  }),
});

export const googleAutocompleteSuggestionSchema = z.object({
  placePrediction: googlePlacesPlacePredictionSchema,
});

export const googlePlacesAutocompleteResponseSchema = z.object({
  suggestions: z.array(googleAutocompleteSuggestionSchema),
});
