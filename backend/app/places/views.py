from django.forms import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter, SearchFilter

from app.common.views import CompanyScopedViewSet
from config.pagination import AdjustableSizePagination
from .models import Place
from .serializers import PlaceSerializer
from .services.google_places import fetch_google_place, fetch_google_autocomplete_suggestion_list, get_place_data_from_google_autocomplete_suggestion, get_place_data_from_google_place


class PlaceViewSet(CompanyScopedViewSet):
    queryset = Place.objects.all().order_by("-created_at")
    serializer_class = PlaceSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["country", "state", "city", "postal_code"]
    search_fields = ["address_full", "address_short", "place_id"]
    ordering_fields = ["created_at", "country", "state", "city"]
    pagination_class = AdjustableSizePagination

    @action(detail=False, methods=["get"], url_path="google-place")
    def google_place(self, request):
        id = request.query_params.get("id", "")
        if not id:
            raise ValidationError("Place ID is required")

        try:
            data = fetch_google_place(id)
            place = get_place_data_from_google_place(data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(place)

    @action(detail=False, methods=["get"], url_path="google-suggestions")
    def google_suggestions(self, request):
        input = request.query_params.get("input", "")
        session_token = request.query_params.get("sessionToken", None)
        if not input:
            return Response([])

        try:
            data = fetch_google_autocomplete_suggestion_list(
                input, session_token)
            suggestion_list = []
            for suggestion in data.get("suggestions", []):
                place_data = get_place_data_from_google_autocomplete_suggestion(
                    suggestion)
                suggestion_list.append(place_data)
            return Response(suggestion_list)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
