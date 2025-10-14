from django.core.management.base import BaseCommand

from app.places.services.google_places_service import GooglePlacesClient, GooglePlacesError


class Command(BaseCommand):
    help = "Fetch places from external API"

    def add_arguments(self, parser):
        parser.add_argument("place_id", type=str, help="Google Place ID")

    def handle(self, *args, **options):
        place_id = options["place_id"]

        try:
            client = GooglePlacesClient()
            response = client.fetch_place_details(place_id)
            place_data = response.parse_place_data()
            self.stdout.write(self.style.SUCCESS(str(place_data.__dict__)))
        except GooglePlacesError as e:
            self.stdout.write(self.style.ERROR(f"Error fetching place: {e}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Unexpected error: {e}"))
