import { z } from "zod";
import { idSchema } from "./basic";
import { listRequestSchema, listResponseSchema } from "./api";
import { EPlaceListOrdering } from "../enums/places";

const googlePlaceIdSchema = z.coerce
  .string()
  .describe("Google Places API place ID");

export const placeSchema = z.object({
  id: idSchema,
  google_place_id: googlePlaceIdSchema,
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

export const googlePlaceSchema = z.object({
  id: googlePlaceIdSchema,
  formattedAddress: z.string(),
  shortFormattedAddress: z.string(),
  postalAddress: z.object({
    regionCode: z.string(),
    languageCode: z.string(),
    postalCode: z.string(),
    administrativeArea: z.string(),
    locality: z.string(),
    addressLines: z.array(z.string()),
  }),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export const googleAutocompleteSuggestionSchema = z.object(
  {
    placePrediction: z.object({
      placeId: googlePlaceIdSchema,
      text: z.object({ text: z.string() }),
    }),
  },
  { required_error: "Address is required" },
);

export const placeListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z.nativeEnum(EPlaceListOrdering).optional(),
    city: z.string().optional(),
  }),
});

export const placeListResponseSchema = listResponseSchema.extend({
  results: z.array(placeSchema),
});

export const googleAutocompleteSuggestionListRequestSchema = z.object({
  params: z.object({
    input: z
      .string()
      .default("")
      .describe("User input for Google Places autocomplete"),
    sessionToken: z
      .string()
      .optional()
      .describe("Unique session token for Google Places API requests"),
  }),
});

export const googleAutocompleteSuggestionListResponseSchema = z.object({
  suggestions: z.array(googleAutocompleteSuggestionSchema),
});

export const cityListRequestSchema = z.object({
  params: z.object({
    search: z.string().optional().describe("Search query to filter cities"),
  }),
});

export const cityListResponseSchema = z.array(z.string());
