import z from "zod";
import {
  cityListRequestSchema,
  cityListResponseSchema,
  googleAutocompleteSuggestionListRequestSchema,
  googleAutocompleteSuggestionListResponseSchema,
  googleAutocompleteSuggestionSchema,
  googlePlaceSchema,
  placeSchema,
  placeListRequestSchema,
  placeListResponseSchema,
} from "../schemas/places";

export type TPlace = z.infer<typeof placeSchema>;

export type TPlaceBasic = z.infer<typeof placeSchema>;

export type TGoogleAutocompleteSuggestion = z.infer<
  typeof googleAutocompleteSuggestionSchema
>;

export type TGooglePlace = z.infer<typeof googlePlaceSchema>;

export type TPlaceListRequest = z.infer<typeof placeListRequestSchema>;

export type TPlaceListResponse = z.infer<typeof placeListResponseSchema>;

export type TGoogleAutocompleteSuggestionListRequest = z.infer<
  typeof googleAutocompleteSuggestionListRequestSchema
>;

export type TGoogleAutocompleteSuggestionListResponse = z.infer<
  typeof googleAutocompleteSuggestionListResponseSchema
>;

export type TCityListRequest = z.infer<typeof cityListRequestSchema>;

export type TCityListResponse = z.infer<typeof cityListResponseSchema>;
