from rest_framework import permissions
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from config.pagination import AdjustableSizePagination
from app.common.views import CompanyScopedViewSet
from app.account.models import CustomUser
from app.account.serializers import CustomUserSerializer


class CustomUserViewSet(CompanyScopedViewSet):
    queryset = CustomUser.objects.all().order_by("-username")
    serializer_class = CustomUserSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ("groups",)
    search_fields = ("username", "email")
    ordering_fields = ("username",)
    pagination_class = AdjustableSizePagination

    @action(detail=False, methods=("get",))
    def count(self, request: Request) -> Response:
        """Return the total count of users in the filtered queryset."""
        count = self.get_queryset().count()
        return Response({"count": count})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    return Response(CustomUserSerializer(request.user).data)
