from django.core.management.base import BaseCommand

from app.places.services.google_places import fetch_google_place


class Command(BaseCommand):
    help = "Fetch places from external API"

    def add_arguments(self, parser):
        parser.add_argument("place_id", type=str, help="Google Place ID")

    def handle(self, *args, **options):
        place_id = options["place_id"]
        data = fetch_google_place(place_id)
        self.stdout.write(self.style.SUCCESS(str(data)))
