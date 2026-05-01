from app.places.models import Place
from .google_places_service import GooglePlacesClient


def create_or_update_place_by_google_place_id(google_place_id: str) -> Place:
    client = GooglePlacesClient()
    response = client.fetch_place_details(google_place_id)

    obj, _ = Place.objects.update_or_create(
        google_place_id=response.id,
        defaults={
            "country": response.postalAddress.regionCode,
            "state": response.postalAddress.administrativeArea,
            "city": response.postalAddress.locality,
            "postal_code": response.postalAddress.postalCode,
            "address_full": response.formattedAddress,
            "address_short": response.shortFormattedAddress,
            "latitude": response.location.latitude,
            "longitude": response.location.longitude,
        }
    )

    return obj
