from typing import Optional
import logging
import requests
from dataclasses import dataclass
from django.conf import settings
from typing import Optional, Dict, Any
from requests.exceptions import RequestException, Timeout

from .exceptions import GooglePlacesError

logger = logging.getLogger(__name__)


# Google Place Details response data classes

@dataclass
class GooglePlaceDetailResponsePostalAddress:
    regionCode: str
    languageCode: str
    postalCode: str
    administrativeArea: str
    locality: str
    addressLines: list[str]


@dataclass
class GooglePlaceDetailResponseLocation:
    latitude: float
    longitude: float


@dataclass
class GooglePlaceDetailResponse:
    id: str
    formattedAddress: str
    shortFormattedAddress: str
    postalAddress: GooglePlaceDetailResponsePostalAddress
    location: GooglePlaceDetailResponseLocation


# Google Autocomplete response data classes

@dataclass
class GoogleAutocompleteResponseSuggestionTextData:
    text: str


@dataclass
class GoogleAutocompleteResponsePlacePredictionData:
    placeId: str
    text: GoogleAutocompleteResponseSuggestionTextData


@dataclass
class GoogleAutocompleteResponseSuggestionData:
    placePrediction: GoogleAutocompleteResponsePlacePredictionData


@dataclass
class GoogleAutocompleteResponse:
    suggestions: list[GoogleAutocompleteResponseSuggestionData]


class GooglePlacesClient:
    """Client for interacting with Google Places API"""

    BASE_URL = "https://places.googleapis.com/v1"
    DEFAULT_COORDINATES = {"latitude": 41.2303, "longitude": -81.4806}
    LOCATION_SEARCH_RADIUS = 0.5
    PLACE_DETAIL_TYPES = [
        "id", "formattedAddress", "shortFormattedAddress",
        "postalAddress", "location"
    ]
    AUTOCOMPLETE_SUGGESTION_TYPES = [
        "suggestions.placePrediction.placeId",
        "suggestions.placePrediction.structuredFormat",
        "suggestions.placePrediction.text.text",
        "suggestions.placePrediction.text.matches",
    ]

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "X-Goog-Api-Key": settings.GOOGLE_MAPS_API_KEY,
        })

    def _get_location_restriction(self) -> dict:
        """Return a location restriction for autocomplete queries."""
        return {
            "rectangle": {
                "low": {
                    "latitude": self.DEFAULT_COORDINATES["latitude"] - self.LOCATION_SEARCH_RADIUS,
                    "longitude": self.DEFAULT_COORDINATES["longitude"] - self.LOCATION_SEARCH_RADIUS,
                },
                "high": {
                    "latitude": self.DEFAULT_COORDINATES["latitude"] + self.LOCATION_SEARCH_RADIUS,
                    "longitude": self.DEFAULT_COORDINATES["longitude"] + self.LOCATION_SEARCH_RADIUS,
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

    def _parse_fetch_place_details_response(self, response: dict) -> GooglePlaceDetailResponse:
        """Parse the response from fetch_place_details into a structured data class"""
        try:
            postal_address = response.get('postalAddress', {})
            return GooglePlaceDetailResponse(
                id=response.get('id', ''),
                formattedAddress=response.get('formattedAddress', ''),
                shortFormattedAddress=response.get(
                    'shortFormattedAddress', ''),
                location=GooglePlaceDetailResponseLocation(
                    latitude=response.get('location', {}).get('latitude', 0.0),
                    longitude=response.get(
                        'location', {}).get('longitude', 0.0),
                ),
                postalAddress=GooglePlaceDetailResponsePostalAddress(
                    regionCode=postal_address.get('regionCode', ''),
                    languageCode=postal_address.get('languageCode', ''),
                    postalCode=postal_address.get('postalCode', ''),
                    administrativeArea=postal_address.get(
                        'administrativeArea', ''),
                    locality=postal_address.get('locality', ''),
                    addressLines=postal_address.get('addressLines', []),
                )
            )
        except Exception as e:
            logger.error(f"Error parsing place details: {e}")
            raise GooglePlacesError(
                f"Failed to parse place details: {str(e)}"
            )

    def _parse_fetch_autocomplete_suggestions_response(self, response: dict) -> GoogleAutocompleteResponse:
        """Parse the response from fetch_autocomplete_suggestions into a structured data class"""
        try:
            suggestions = []
            for suggestion in response.get("suggestions", []):
                place_prediction = suggestion.get("placePrediction", {})
                placeId = place_prediction.get("placeId", "")
                text_data = place_prediction.get("text", {})
                suggestions.append(
                    GoogleAutocompleteResponseSuggestionData(
                        placePrediction=GoogleAutocompleteResponsePlacePredictionData(
                            placeId=placeId,
                            text=GoogleAutocompleteResponseSuggestionTextData(
                                text=text_data.get("text", "")
                            )
                        )
                    )
                )
            return GoogleAutocompleteResponse(suggestions=suggestions)
        except Exception as e:
            logger.error(f"Error parsing autocomplete suggestions: {e}")
            raise GooglePlacesError(
                f"Failed to parse autocomplete suggestions: {str(e)}"
            )

    def fetch_place_details(self, place_id: str) -> GooglePlaceDetailResponse:
        """Fetch detailed place information by place ID"""

        url = f"{self.BASE_URL}/places/{place_id}"
        headers = {"X-Goog-FieldMask": ",".join(self.PLACE_DETAIL_TYPES)}

        logger.info(f"Fetching place details for ID: {place_id}")
        response = self._make_request("GET", url, headers=headers)

        return self._parse_fetch_place_details_response(response)

    def fetch_autocomplete_suggestions(
        self,
        input_text: str,
        session_token: Optional[str] = None
    ) -> GoogleAutocompleteResponse:
        """Fetch autocomplete suggestions for given input"""
        url = f"{self.BASE_URL}/places:autocomplete"
        headers = {
            "X-Goog-FieldMask": ",".join(self.AUTOCOMPLETE_SUGGESTION_TYPES)}
        body = {
            "input": input_text,
            "sessionToken": session_token,
            "origin": self.DEFAULT_COORDINATES,
            "locationRestriction": self._get_location_restriction(),
            "includedPrimaryTypes": ["street_address"],
            "languageCode": "en-US",
            "regionCode": "us",
        }

        logger.info(f"Fetching autocomplete suggestions for: {input_text}")
        response = self._make_request("POST", url, headers=headers, json=body)

        return self._parse_fetch_autocomplete_suggestions_response(response)
