import z from "zod";
import {
  googleAutocompleteSuggestionListRequestSchema,
  googleAutocompleteSuggestionListResponseSchema,
  googleAutocompleteSuggestionSchema,
  placeBasicSchema,
  placeCreateSchema,
  placeListRequestSchema,
  placeListResponseSchema,
  placeSchema,
  placeUpdateSchema,
} from "../schemas/places";

export type TPlace = z.infer<typeof placeSchema>;

export type TPlaceBasic = z.infer<typeof placeBasicSchema>;

export type TPlaceCreate = z.infer<typeof placeCreateSchema>;

export type TPlaceUpdate = z.infer<typeof placeUpdateSchema>;

export interface PlaceWriteable {
  id: number;
  google_place_id: string;
}

export type TGoogleAutocompleteSuggestion = z.infer<
  typeof googleAutocompleteSuggestionSchema
>;

export type TPlaceListRequest = z.infer<typeof placeListRequestSchema>;

export type TPlaceListResponse = z.infer<typeof placeListResponseSchema>;

export type TGoogleAutocompleteSuggestionListRequest = z.infer<
  typeof googleAutocompleteSuggestionListRequestSchema
>;

export type TGoogleAutocompleteSuggestionListResponse = z.infer<
  typeof googleAutocompleteSuggestionListResponseSchema
>;

/** Google Places API */

export interface GooglePlacesPlace {
  id: string;
  formattedAddress: string;
  location: { latitude: number; longitude: number };
  shortFormattedAddress: string;
  postalAddress: {
    regionCode: string;
    languageCode: string;
    postalCode: string;
    administrativeArea: string;
    locality: string;
    addressLines: Array<string>;
  };
}

export interface GooglePlacesPlacePrediction {
  placeId: string;
  text: {
    text: string;
    matches: Array<{ endOffset: number }>;
  };
  structuredFormat: {
    mainText: {
      text: string;
      matches: Array<{ endOffset: number }>;
    };
    secondaryText: { text: string };
  };
}

export interface GoogleAutocompleteSuggestion {
  placePrediction: GooglePlacesPlacePrediction;
}

export interface GooglePlacesAutocompleteResponse {
  suggestions: Array<GoogleAutocompleteSuggestion>;
}
