from django.forms import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter, SearchFilter
import logging

from app.common.views import CompanyScopedViewSet
from config.pagination import AdjustableSizePagination
from .models import Place
from .serializers import PlaceReadSerializer
from app.places.services.google_places import GooglePlacesClient

logger = logging.getLogger(__name__)


class PlaceViewSet(CompanyScopedViewSet):
    queryset = Place.objects.all().order_by("-created_at")
    serializer_class = PlaceReadSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ("country", "state", "city", "postal_code")
    search_fields = ("address_full", "address_short", "place_id")
    ordering_fields = ("created_at", "country", "state", "city")
    pagination_class = AdjustableSizePagination

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.google_places_client = GooglePlacesClient()

    @action(detail=False, methods=["get"], url_path="google-place")
    def google_place(self, request):
        """Fetch place details from Google Places API by place ID."""
        place_id = request.query_params.get("id", "").strip()

        if not place_id:
            return Response(
                {"detail": "Place ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            response = self.google_places_client.fetch_place_details(place_id)
            place_data = response.parse_place_data()
            return Response(place_data.__dict__)
        except Exception as e:
            logger.error(f"Error fetching Google place {place_id}: {str(e)}")
            return Response(
                {"detail": "Failed to fetch place data"},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=["get"], url_path="google-autocomplete-suggestions")
    def google_autocomplete_suggestions(self, request):
        """Get Google Places autocomplete suggestions."""
        input_text = request.query_params.get("input", "").strip()
        session_token = request.query_params.get("sessionToken")

        if not input_text:
            return Response([])

        try:
            client = GooglePlacesClient()
            response = client.fetch_autocomplete_suggestions(
                input_text, session_token
            )
            autocomplete_data = response.parse_suggestions()
            autocomplete_dicts = [
                suggestion.__dict__ for suggestion in autocomplete_data]

            return Response(autocomplete_dicts)
        except Exception as e:
            logger.error(
                f"Error fetching Google suggestions for '{input_text}': {str(e)}")
            return Response(
                {"detail": "Failed to fetch suggestions"},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=["get"], url_path="cities")
    def list_cities(self, request: Request) -> Response:
        """List unique cities for the current user's company."""
        user_company = getattr(self.request.user, "company", None)
        if not user_company:
            raise ValidationError("User does not belong to a company.")

        cities = (
            Place.objects
            .filter(company=user_company, city__isnull=False)
            .values_list("city", flat=True)
            .distinct()
            .order_by("city")
        )

        return Response(list(cities))
