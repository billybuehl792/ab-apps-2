from typing import Optional
from rest_framework import serializers

from app.places.models import Place
from app.companies.models import Company
from app.places.services.google_places import fetch_google_place, get_place_data_from_google_place


def get_place_by_id(id:  int | str, company: Company) -> Optional[Place]:
    """
    Retrieve a place by its internal ID or Google Place ID.
    """

    if not company:
        return None

    if str(id).isdigit():
        return Place.objects.filter(id=id, company=company).first()
    else:
        return Place.objects.filter(google_place_id=str(id), company=company).first()


def get_or_create_place_by_id(id: int | str, company: Optional[Company]) -> Place:
    """
    Get a Place by its internal ID or Google Place ID, or create it by fetching details
    from Google Places API if it doesn't exist.
    """

    if not company:
        raise serializers.ValidationError(
            {"place": "User must belong to a company to set a place."})

    place_id = str(id)
    place = get_place_by_id(place_id, company)

    if not place:
        try:
            google_place = fetch_google_place(place_id)
            place_data = get_place_data_from_google_place(google_place)
            place = Place.objects.create(company=company, **place_data)
        except Exception as e:
            raise serializers.ValidationError(
                {"place": f"Error fetching place from Google: {str(e)}"})

    return place
