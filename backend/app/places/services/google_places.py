from typing import Optional
import logging
import requests
from dataclasses import dataclass
from django.conf import settings
from typing import Optional, Dict, Any
from requests.exceptions import RequestException, Timeout

logger = logging.getLogger(__name__)

# Configuration constants
DEFAULT_COORDINATES = {"latitude": 41.2303, "longitude": -81.4806}
LOCATION_SEARCH_RADIUS = 0.5


@dataclass
class PlaceData:
    google_place_id: str
    country: str = ""
    state: str = ""
    city: str = ""
    postal_code: str = ""
    address_full: str = ""
    address_short: str = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None


@dataclass
class AutocompleteSuggestionData:
    google_place_id: str
    address_full: str = ""
    address_short: str = ""
    city: str = ""
    state: str = ""


@dataclass
class GooglePlaceResponse:
    """Wrapper for Google Place API response with parsing capabilities"""
    raw_data: Dict[Any, Any]

    def parse_place_data(self) -> PlaceData:
        """Parse the raw response into PlaceData"""
        return parse_place_data(self.raw_data)


@dataclass
class GoogleAutocompleteResponse:
    """Wrapper for Google Autocomplete API response with parsing capabilities"""
    raw_data: Dict[Any, Any]

    def parse_suggestions(self) -> list[AutocompleteSuggestionData]:
        """Parse the raw response into list of AutocompleteSuggestionData"""
        suggestions = self.raw_data.get("suggestions", [])
        return [parse_autocomplete_suggestion(suggestion) for suggestion in suggestions]

    def parse_first_suggestion(self) -> Optional[AutocompleteSuggestionData]:
        """Parse the first suggestion from the response"""
        suggestions = self.parse_suggestions()
        return suggestions[0] if suggestions else None


class GooglePlacesError(Exception):
    """Custom exception for Google Places API errors"""
    pass


class GooglePlacesClient:
    """Client for interacting with Google Places API"""

    BASE_URL = "https://places.googleapis.com/v1"

    def __init__(self):
        self.api_key = settings.GOOGLE_MAPS_API_KEY
        self.session = requests.Session()
        self.session.headers.update({
            "X-Goog-Api-Key": self.api_key,
        })

    def _get_location_restriction(self) -> dict:
        """Return a location restriction for autocomplete queries."""
        return {
            "rectangle": {
                "low": {
                    "latitude": DEFAULT_COORDINATES["latitude"] - 0.5,
                    "longitude": DEFAULT_COORDINATES["longitude"] - 0.5,
                },
                "high": {
                    "latitude": DEFAULT_COORDINATES["latitude"] + 0.5,
                    "longitude": DEFAULT_COORDINATES["longitude"] + 0.5,
                },
            },
        }

    def _make_request(self, method: str, url: str, **kwargs) -> Dict[Any, Any]:
        """Make HTTP request with error handling"""
        try:
            response = self.session.request(method, url, timeout=10, **kwargs)
            response.raise_for_status()
            return response.json()
        except Timeout:
            logger.error(f"Timeout when calling {url}")
            raise GooglePlacesError("Request timed out")
        except RequestException as e:
            logger.error(f"Request failed for {url}: {e}")
            error_msg = "Unknown error"
            if hasattr(e.response, 'json') and e.response is not None:
                try:
                    error_data = e.response.json()
                    error_msg = error_data.get(
                        'error', {}).get('message', str(e))
                except:
                    error_msg = str(e)
            raise GooglePlacesError(f"API request failed: {error_msg}")

    def fetch_place_details(self, place_id: str) -> GooglePlaceResponse:
        """Fetch detailed place information by place ID"""
        url = f"{self.BASE_URL}/places/{place_id}"
        headers = {
            "X-Goog-FieldMask": ",".join([
                "id", "formattedAddress", "shortFormattedAddress",
                "postalAddress", "location"
            ])
        }

        logger.info(f"Fetching place details for ID: {place_id}")
        raw_data = self._make_request("GET", url, headers=headers)
        return GooglePlaceResponse(raw_data=raw_data)

    def fetch_autocomplete_suggestions(
        self,
        input_text: str,
        session_token: Optional[str] = None
    ) -> GoogleAutocompleteResponse:
        """Fetch autocomplete suggestions for given input"""
        url = f"{self.BASE_URL}/places:autocomplete"
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": self.api_key,
            "X-Goog-FieldMask": ",".join([
                "suggestions.placePrediction.placeId",
                "suggestions.placePrediction.structuredFormat",
                "suggestions.placePrediction.text.text",
                "suggestions.placePrediction.text.matches",
            ])
        }

        body = {
            "input": input_text,
            "sessionToken": session_token,
            "origin": DEFAULT_COORDINATES,
            "locationRestriction": self._get_location_restriction(),
            "includedPrimaryTypes": ["street_address"],
            "languageCode": "en-US",
            "regionCode": "us",
        }

        logger.info(f"Fetching autocomplete suggestions for: {input_text}")
        raw_data = self._make_request("POST", url, headers=headers, json=body)
        return GoogleAutocompleteResponse(raw_data=raw_data)


def parse_place_data(google_place: Dict[Any, Any]) -> PlaceData:
    """Convert Google Place API response to PlaceData"""
    try:
        postal_address = google_place.get("postalAddress", {})
        location = google_place.get("location", {})

        return PlaceData(
            google_place_id=google_place.get("id", ""),
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
        logger.error(f"Error parsing place data: {e}")
        raise GooglePlacesError(f"Failed to parse place data: {str(e)}")


def parse_autocomplete_suggestion(google_suggestion: Dict[Any, Any]) -> AutocompleteSuggestionData:
    """Convert Google Autocomplete API response to AutocompleteSuggestionData"""
    try:
        place_prediction = google_suggestion.get("placePrediction", {})
        text = place_prediction.get("text", {})
        structured_format = place_prediction.get("structuredFormat", {})
        main_text = structured_format.get("mainText", {})
        secondary_text = structured_format.get("secondaryText", {})

        # Parse city and state from secondary text
        city_state_parts = secondary_text.get("text", "").split(", ")
        city = city_state_parts[0] if city_state_parts else ""
        state = city_state_parts[1] if len(city_state_parts) > 1 else ""

        return AutocompleteSuggestionData(
            google_place_id=place_prediction.get("placeId", ""),
            address_full=text.get("text", ""),
            address_short=main_text.get("text", ""),
            city=city,
            state=state,
        )
    except Exception as e:
        logger.error(f"Error parsing autocomplete suggestion: {e}")
        raise GooglePlacesError(f"Failed to parse suggestion data: {str(e)}")
