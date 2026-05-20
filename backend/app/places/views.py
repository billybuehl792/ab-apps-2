from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.status import HTTP_400_BAD_REQUEST
from dataclasses import asdict


from .models import Place
from .serializers import PlaceReadSerializer, PlaceWriteSerializer
from .services.google_places_service import GooglePlacesClient


class PlaceViewSet(ModelViewSet):
    queryset = Place.objects.all()
    serializer_class = PlaceReadSerializer
    ordering = ("city",)
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_fields = ("city",)
    search_fields = ("address_full", "address_short", "google_place_id")
    ordering_fields = ("created_at", "updated_at", "country", "state", "city")
    permission_classes = (IsAuthenticated,)

    def get_serializer_class(self):  # type: ignore
        if self.action in ("list", "retrieve"):
            return PlaceReadSerializer
        return PlaceWriteSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        return Response(PlaceReadSerializer(instance).data)

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        return Response(PlaceReadSerializer(instance).data)

    @action(
        detail=False,
        methods=("get",),
        url_path="google-place/(?P<place_id>[^/.]+)",
    )
    def google_place(self, request, place_id=None):
        """Fetch place details from Google Places API by place ID."""

        google_places_client = GooglePlacesClient()
        place_id = (place_id or request.query_params.get("id", "")).strip()

        if not place_id:
            return Response(
                {"detail": "Place ID is required"},
                status=HTTP_400_BAD_REQUEST,
            )
        try:
            res = google_places_client.fetch_place_details(place_id)
            return Response(asdict(res))
        except Exception as e:
            return Response(
                {"detail": "Failed to fetch place data"},
                status=HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=("get",), url_path="google-autocomplete-suggestions")
    def google_autocomplete_suggestions(self, request):
        """Get Google Places autocomplete suggestions."""

        google_places_client = GooglePlacesClient()
        input_text = request.query_params.get("input", "").strip()
        session_token = request.query_params.get("sessionToken")

        if not input_text:
            return Response([])

        try:
            res = google_places_client.fetch_autocomplete_suggestions(
                input_text, session_token
            )
            return Response(asdict(res))
        except Exception as e:
            return Response(
                {"detail": "Failed to fetch suggestions"},
                status=HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=("get",), url_path="cities")
    def cities(self, request):
        """List all unique cities from places."""
        search_query = request.query_params.get('search', '').strip()
        cities = Place.objects.values_list('city', flat=True).distinct()

        if search_query:
            cities = cities.filter(city__icontains=search_query)

        return Response(list(cities))
