from typing import Optional

from app.places.models import Place
from app.companies.models import Company
from app.places.services.google_places_service import GooglePlaceResponse, GooglePlacesClient


class PlaceServiceError(Exception):
    """Base exception for place service errors."""
    pass


class PlaceNotFoundError(PlaceServiceError):
    """Raised when a place cannot be found or created."""
    pass


class InvalidPlaceDataError(PlaceServiceError):
    """Raised when place data is invalid."""
    pass


class PlaceService:
    """Service class for place-related operations."""

    _google_places_client = GooglePlacesClient()

    def get_or_create(self, place_data: dict, company: Company) -> tuple[Place, bool]:
        """
        Get a Place by its internal ID or Google Place ID, or create it by fetching details
        from Google Places API if it doesn't exist.
        """

        # Determine the place identifier
        place_id = place_data.get('id', None)
        google_place_id = place_data.get('google_place_id', None)

        existing_place = None
        if place_id:
            existing_place = Place.objects.filter(
                id=int(place_id), company=company).first()
            if existing_place:
                return (existing_place, False)
        if google_place_id:
            existing_place = Place.objects.filter(
                google_place_id=google_place_id, company=company).first()
            if existing_place:
                return (existing_place, False)
            else:
                # Create new place from Google Places API
                google_place = self.fetch_google_place(google_place_id)
                created_place = self._create_place_from_google_place(
                    google_place, company)
                return (created_place, True)

        raise PlaceNotFoundError(
            "Place data dictionary must contain valid 'id' or 'google_place_id'.")

    def fetch_google_place(self, place_id: str):
        """Fetch place details from Google Places API."""
        try:
            return self._google_places_client.fetch_place_details(place_id)
        except Exception as e:
            raise PlaceServiceError(
                f"Failed to fetch place details: {str(e)}")

    def fetch_google_autocomplete_suggestions(self, input_text: str, session_token: Optional[str] = None):
        """Fetch autocomplete suggestions from Google Places API."""
        try:
            return self._google_places_client.fetch_autocomplete_suggestions(input_text, session_token)
        except Exception as e:
            raise PlaceServiceError(
                f"Failed to fetch autocomplete suggestions: {str(e)}")

    def _create_place_from_google_place(self, google_place: GooglePlaceResponse, company: Company) -> Place:
        """Create a new place by fetching data from Google Places API."""
        try:
            place_data = google_place.parse_place_data()
            place, created = Place.objects.get_or_create(
                company=company, **place_data.__dict__)

            return place
        except (AttributeError, ValueError, TypeError) as e:
            raise PlaceNotFoundError(
                f"Invalid place data received from Google Places API: {str(e)}")
        except Exception as e:
            raise PlaceNotFoundError(
                f"Could not create place from Google Places API: {str(e)}")
