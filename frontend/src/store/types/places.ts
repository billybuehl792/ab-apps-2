import z from "zod";
import {
  googleAutocompleteSuggestionListRequestSchema,
  googleAutocompleteSuggestionListResponseSchema,
  googleAutocompleteSuggestionSchema,
  googlePlaceSchema,
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
