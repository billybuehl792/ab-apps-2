from django.core.management.base import BaseCommand

from app.places.services.google_places_service import GooglePlacesClient


class Command(BaseCommand):
    help = "Fetch Google Places autocomplete suggestions"

    def add_arguments(self, parser):
        parser.add_argument("input", type=str,
                            help="Input for autocomplete suggestions")
        parser.add_argument("--session_token", type=str,
                            help="Session token for autocomplete")

    def handle(self, *args, **options):
        input_text = options["input"]
        session_token = options.get("session_token")

        # Use the new GooglePlacesClient
        client = GooglePlacesClient()
        response = client.fetch_autocomplete_suggestions(
            input_text, session_token)

        # Parse and display suggestions
        suggestions = response.parse_suggestions()

        self.stdout.write(self.style.SUCCESS(
            f"Found {len(suggestions)} suggestions:"))
        for i, suggestion in enumerate(suggestions, 1):
            self.stdout.write(f"{i}. {suggestion.google_place_id}")
            self.stdout.write(f"   {suggestion.address_full}")
            self.stdout.write(f"   Short: {suggestion.address_short}")
            self.stdout.write(
                f"   City: {suggestion.city}, State: {suggestion.state}")
            self.stdout.write("")
