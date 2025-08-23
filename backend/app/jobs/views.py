from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated

from .models import Job
from .serializers import JobSerializer


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.select_related(
        "client").all().order_by("-created_at")
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["client", "status", "scheduled_date", "completed_date"]
    search_fields = ["title", "description",
                     "client__first_name", "client__last_name", "client__email"]
    ordering_fields = ["created_at",
                       "scheduled_date", "completed_date", "cost"]
