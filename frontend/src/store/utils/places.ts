import type {
  GooglePlacesPlace,
  GooglePlacesPlacePrediction,
  Place,
} from "../types/places";

/**
 * Calculates a bounding box around a given latitude and longitude, extending
 * a specified distance in miles. The bounding box is represented as a
 * `google.maps.LatLngBoundsLiteral` object.
 *
 * @param latLng - The latitude and longitude of the central point.
 * @param distanceInMiles - The distance in miles to extend from the central point
 *                          to calculate the bounds. Defaults to 50 miles.
 * @returns A `google.maps.LatLngBoundsLiteral` object representing the bounding box
 *          with `north`, `south`, `east`, and `west` boundaries.
 */
const getBoundsFromLatLng = (
  latLng: google.maps.LatLngLiteral,
  distanceInMiles = 50
): google.maps.LatLngBoundsLiteral => {
  const milesToDegrees = distanceInMiles / 69; // Approx: 1 degree = ~69 miles
  const latDelta = milesToDegrees;
  const lngDelta =
    distanceInMiles / (Math.cos((latLng.lat * Math.PI) / 180) * 69);

  return {
    east: latLng.lng + lngDelta,
    north: latLng.lat + latDelta,
    south: latLng.lat - latDelta,
    west: latLng.lng - lngDelta,
  };
};

const getPlaceFromGooglePlacesPlace = (place: GooglePlacesPlace): Place => {
  return {
    id: Math.floor(Math.random() * -1_000_000), // Temporary ID for frontend use
    google_place_id: place.id,
    country: place.postalAddress.regionCode,
    state: place.postalAddress.administrativeArea,
    city: place.postalAddress.locality,
    postal_code: place.postalAddress.postalCode,
    address_full: place.formattedAddress,
    address_short: place.shortFormattedAddress,
    latitude: place.location.latitude,
    longitude: place.location.longitude,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

const getPlaceFromGooglePlacesPlacePrediction = (
  prediction: GooglePlacesPlacePrediction
): Place => {
  return {
    id: Math.floor(Math.random() * -1_000_000), // Temporary ID for frontend use
    google_place_id: prediction.placeId,
    country: "",
    state: "",
    city: "",
    postal_code: "",
    address_full: prediction.structuredFormat.mainText.text,
    address_short: prediction.structuredFormat.secondaryText.text,
    latitude: 0,
    longitude: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const placeUtils = {
  getBoundsFromLatLng,
  getPlaceFromGooglePlacesPlace,
  getPlaceFromGooglePlacesPlacePrediction,
};
