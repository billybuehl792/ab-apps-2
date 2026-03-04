import { z } from "zod";
import { idSchema } from "./basic";
import { listRequestSchema, listResponseSchema } from "./api";
import { EPlaceListOrdering } from "../enums/places";

export const placeSchema = z.object({
  id: idSchema,
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
  id: idSchema,
  google_place_id: z.coerce.string().describe("Google Places API place ID"),
  address_short: z.coerce.string(),
  city: z.coerce.string(),
  state: z.coerce.string(),
});

export const placeCreateSchema = z.object({
  google_place_id: z.string().describe("Google Places API place ID"),
});

export const placeWriteableSchema = z.object({
  id: idSchema,
  google_place_id: z.string(),
});

export const googleAutocompleteSuggestionSchema = z.object({
  google_place_id: z.string().describe("Google Places API place ID"),
  address_full: z.string(),
  address_short: z.string(),
  city: z.string(),
  state: z.string(),
});

export const placeListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z
      .nativeEnum(EPlaceListOrdering)
      .optional()
      .default(EPlaceListOrdering.CreatedAtDesc),
  }),
});

export const placeListResponseSchema = listResponseSchema.extend({
  results: z.array(placeSchema),
});

export const googleAutocompleteSuggestionListRequestSchema = z.object({
  params: z.object({
    input: z.string().describe("User input for Google Places autocomplete"),
    sessionToken: z
      .string()
      .optional()
      .describe("Unique session token for Google Places API requests"),
  }),
});

export const googleAutocompleteSuggestionListResponseSchema = z.array(
  googleAutocompleteSuggestionSchema,
);

// Google Places API schemas
// export const googlePlacesPlaceSchema = z.object({
//   id: z.string(),
//   formattedAddress: z.string(),
//   location: z.object({
//     latitude: z.number(),
//     longitude: z.number(),
//   }),
//   shortFormattedAddress: z.string(),
//   postalAddress: z.object({
//     regionCode: z.string(),
//     languageCode: z.string(),
//     postalCode: z.string(),
//     administrativeArea: z.string(),
//     locality: z.string(),
//     addressLines: z.array(z.string()),
//   }),
// });

// export const googlePlacesPlacePredictionSchema = z.object({
//   placeId: z.string(),
//   text: z.object({
//     text: z.string(),
//     matches: z.array(z.object({ endOffset: z.number() })),
//   }),
//   structuredFormat: z.object({
//     mainText: z.object({
//       text: z.string(),
//       matches: z.array(z.object({ endOffset: z.number() })),
//     }),
//     secondaryText: z.object({ text: z.string() }),
//   }),
// });

// export const googleAutocompleteSuggestionSchema = z.object({
//   placePrediction: googlePlacesPlacePredictionSchema,
// });

// export const googlePlacesAutocompleteResponseSchema = z.object({
//   suggestions: z.array(googleAutocompleteSuggestionSchema),
// });
