import requests
from django.conf import settings
from typing import Optional

from app.places.models import Place

# Default coordinates for Twinsburg, OH
DEFAULT_LAT_LNG = {"latitude": 41.2303, "longitude": -81.4806}

DEFAULT_PLACE_FIELDS = [
    "id",
    "formattedAddress",
    "shortFormattedAddress",
    "postalAddress",
    "location",
]
DEFAULT_AUTOCOMPLETE_FIELDS = [
    "suggestions.placePrediction.placeId",
    "suggestions.placePrediction.structuredFormat",
    "suggestions.placePrediction.text.text",
    "suggestions.placePrediction.text.matches",
]
DEFAULT_AUTOCOMPLETE_OPTIONS = {
    "origin": DEFAULT_LAT_LNG,
    "locationRestriction": {
        "rectangle": {
            "low": {
                "latitude": DEFAULT_LAT_LNG["latitude"] - 0.5,
                "longitude": DEFAULT_LAT_LNG["longitude"] - 0.5,
            },
            "high": {
                "latitude": DEFAULT_LAT_LNG["latitude"] + 0.5,
                "longitude": DEFAULT_LAT_LNG["longitude"] + 0.5,
            },
        },
    },
    "includedPrimaryTypes": ["street_address"],
    "languageCode": "en-US",
    "regionCode": "us",
}


def fetch_google_place(place_id: str) -> dict:
    url = f"https://places.googleapis.com/v1/places/{place_id}"
    headers = {
        "X-Goog-Api-Key": settings.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": ",".join(DEFAULT_PLACE_FIELDS),
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        try:
            error_data = response.json()
        except Exception:
            error_data = response.text
        raise Exception(f"Failed to fetch place details: {error_data}")

    return response.json()


def fetch_google_autocomplete_suggestion_list(input: str, session_token: Optional[str] = None) -> dict:
    url = f"https://places.googleapis.com/v1/places:autocomplete"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": settings.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": ",".join(DEFAULT_AUTOCOMPLETE_FIELDS),
    }
    body = {**DEFAULT_AUTOCOMPLETE_OPTIONS,
            "sessionToken": session_token, "input": input}
    response = requests.post(url, headers=headers, json=body)
    if response.status_code != 200:
        try:
            error_data = response.json()
        except Exception:
            error_data = response.text
        raise Exception(
            f"Failed to fetch autocomplete suggestions: {error_data}")

    return response.json()


def get_place_data_from_google_place(google_place: dict) -> dict:
    try:
        postal_address = google_place.get("postalAddress", {})
        location = google_place.get("location", {})
        return dict(
            google_place_id=google_place.get("id"),
            country=postal_address.get("regionCode", ""),
            state=postal_address.get("administrativeArea", ""),
            city=postal_address.get("locality", ""),
            postal_code=postal_address.get("postalCode", ""),
            address_full=google_place.get("formattedAddress", ""),
            address_short=google_place.get("shortFormattedAddress", ""),
            latitude=location.get("latitude"),
            longitude=location.get("longitude"),
        )
    except Exception as e:
        raise Exception(f"Error formatting place data: {str(e)}")


def get_place_data_from_google_autocomplete_suggestion(google_suggestion: dict) -> dict:
    try:
        placePrediction = google_suggestion.get("placePrediction", {})
        text = placePrediction.get("text", {})
        structuredFormat = placePrediction.get("structuredFormat", {})
        mainText = structuredFormat.get("mainText", {})
        secondaryText = structuredFormat.get("secondaryText", {})
        city_state = secondaryText.get("text", "").split(", ")
        return dict(
            google_place_id=placePrediction.get("placeId", ""),
            address_full=text.get("text", ""),
            address_short=mainText.get("text", ""),
            city=city_state[0] if len(city_state) > 0 else "",
            state=city_state[1] if len(city_state) > 1 else "",
        )
    except Exception as e:
        raise Exception(
            f"Error formatting autocomplete suggestion data: {str(e)}")
