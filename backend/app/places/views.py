from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.status import HTTP_400_BAD_REQUEST
import logging

from app.places.services.place_service import PlaceService
from app.common.services.utils import get_user_company_from_request_or_raise
from .models import Place
from .serializers import PlaceReadSerializer

logger = logging.getLogger(__name__)


class PlaceViewSet(ModelViewSet):
    serializer_class = PlaceReadSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_fields = ("country", "state", "city", "postal_code")
    search_fields = ("address_full", "address_short", "place_id")
    ordering_fields = ("created_at", "country", "state", "city")
    permission_classes = (IsAuthenticated,)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._place_service = PlaceService()

    def get_queryset(self):  # type: ignore
        company = get_user_company_from_request_or_raise(self.request)
        return Place.objects.filter(company=company).order_by("-created_at")

    @action(detail=False, methods=("get",), url_path="google-place")
    def google_place(self, request):
        """Fetch place details from Google Places API by place ID."""
        place_id = request.query_params.get("id", "").strip()

        if not place_id:
            return Response(
                {"detail": "Place ID is required"},
                status=HTTP_400_BAD_REQUEST
            )

        try:
            res = self._place_service.fetch_google_place(
                place_id)
            place_data = res.parse_place_data()
            return Response(place_data.data())
        except Exception as e:
            logger.error(f"Error fetching Google place {place_id}: {str(e)}")
            return Response(
                {"detail": "Failed to fetch place data"},
                status=HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=("get",), url_path="google-autocomplete-suggestions")
    def google_autocomplete_suggestions(self, request):
        """Get Google Places autocomplete suggestions."""
        input_text = request.query_params.get("input", "").strip()
        session_token = request.query_params.get("sessionToken")

        if not input_text:
            return Response([])

        try:
            res = self._place_service.fetch_google_autocomplete_suggestions(
                input_text, session_token
            )
            autocomplete_data = res.parse_suggestions()

            return Response([
                suggestion.data() for suggestion in autocomplete_data])
        except Exception as e:
            logger.error(
                f"Error fetching Google suggestions for '{input_text}': {str(e)}")
            return Response(
                {"detail": "Failed to fetch suggestions"},
                status=HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=("get",), url_path="cities")
    def list_cities(self, request) -> Response:
        """List unique cities for the current user's company."""
        company = get_user_company_from_request_or_raise(request)
        cities = (
            Place.objects
            .filter(company=company, city__isnull=False)
            .values_list("city", flat=True)
            .distinct()
            .order_by("city")
        )

        return Response(list(cities))
