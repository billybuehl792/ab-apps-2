import type { ApiListRequest } from "./api";

export interface Place {
  id: number;
  /** Google `placeId` */
  google_place_id: string;
  /** Country code (e.g., "US") */
  country: string;
  state: string;
  city: string;
  postal_code: string;
  /** Human-readable address */
  address_full: string;
  /** Shortened human-readable address */
  address_short: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

/** API */

export type PlaceApiListRequest = ApiListRequest;

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
