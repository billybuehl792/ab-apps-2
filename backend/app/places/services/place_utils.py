from typing import Optional
from rest_framework.request import Request

from app.places.models import Place
from app.companies.models import Company
from app.places.services.google_places import GooglePlacesClient


class PlaceServiceError(Exception):
    """Base exception for place service errors."""
    pass


class PlaceNotFoundError(PlaceServiceError):
    """Raised when a place cannot be found or created."""
    pass


class InvalidPlaceDataError(PlaceServiceError):
    """Raised when place data is invalid."""
    pass


def get_or_create_place_by_id(request: Request, id: int | str) -> Place:
    """
    Get a Place by its internal ID or Google Place ID, or create it by fetching details
    from Google Places API if it doesn't exist.

    Args:
        request: The HTTP request containing user information
        id: Either an internal Place ID (int) or Google Place ID (str)

    Returns:
        Place: The found or newly created Place instance

    Raises:
        InvalidPlaceDataError: If user has no company or ID is empty
        PlaceNotFoundError: If place cannot be created from Google API
    """
    company = _get_user_company(request)
    if not id:
        raise InvalidPlaceDataError("Place ID cannot be empty.")

    # Try to find existing place
    place = _find_existing_place(id, company)
    if place:
        return place

    # Create new place from Google Places API
    return _create_place_from_google(str(id), company)


def _get_user_company(request: Request) -> Company:
    """Extract and validate user's company from request."""
    if not request or not request.user:
        raise InvalidPlaceDataError("Request must contain authenticated user.")

    company = getattr(request.user, "company", None)
    if not company:
        raise InvalidPlaceDataError(
            "User must belong to a company to set a place.")

    return company


def _find_existing_place(id: int | str, company: Company) -> Optional[Place]:
    """
    Find existing place by internal ID or Google Place ID.

    Args:
        id: Either an internal Place ID (int) or Google Place ID (str)
        company: The company to filter by

    Returns:
        Place instance if found, None otherwise
    """
    if isinstance(id, int) or str(id).isdigit():
        return Place.objects.filter(id=int(id), company=company).first()
    else:
        return Place.objects.filter(google_place_id=id, company=company).first()


def _create_place_from_google(place_id: str, company: Company) -> Place:
    """
    Create a new place by fetching data from Google Places API.

    Args:
        place_id: Google Place ID
        company: Company to associate the place with

    Returns:
        Newly created Place instance

    Raises:
        PlaceNotFoundError: If Google API call fails or returns invalid data
    """
    try:
        client = GooglePlacesClient()
        response = client.fetch_place_details(place_id)
        place_data = response.parse_place_data()
        place, created = Place.objects.get_or_create(
            company=company, **place_data.__dict__)

        return place
    except (AttributeError, ValueError, TypeError) as e:
        raise PlaceNotFoundError(
            f"Invalid place data received from Google Places API: {str(e)}")
    except Exception as e:
        raise PlaceNotFoundError(
            f"Could not create place from Google Places API: {str(e)}")
