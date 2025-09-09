from django.core.management.base import BaseCommand

from app.places.services.google_places import fetch_google_autocomplete_suggestion_list


class Command(BaseCommand):
    help = "Fetch places from external API"

    def add_arguments(self, parser):
        parser.add_argument("input", type=str,
                            help="Input for autocomplete suggestions")
        parser.add_argument("--session_token", type=str,
                            help="Session token for autocomplete")

    def handle(self, *args, **options):
        input_text = options["input"]
        session_token = options.get("session_token")
        data = fetch_google_autocomplete_suggestion_list(
            input_text, session_token)
        self.stdout.write(self.style.SUCCESS(str(data)))
