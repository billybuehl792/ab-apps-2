from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter, SearchFilter

from .serializers import PlaceSerializer
from .models import Place


class PlaceViewSet(ModelViewSet):
    queryset = Place.objects.all()
    serializer_class = PlaceSerializer
    ordering = ("city",)
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_fields = ("country", "state", "city", "postal_code")
    search_fields = ("street_address", "city")
    ordering_fields = ("created_at", "updated_at", "country", "state", "city")
    permission_classes = (IsAuthenticated,)
