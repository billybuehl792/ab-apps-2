from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.decorators import api_view, permission_classes

from app.account.models import CustomUser
from app.account.serializers import CustomUserSerializer
from app.common.permissions import IsFromCompany
from app.common.services.utils import get_user_company_from_request_or_raise


class CustomUserViewSet(ModelViewSet):
    permission_classes = (IsAuthenticated, IsFromCompany, IsAdminUser)
    serializer_class = CustomUserSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
    filterset_fields = ("groups",)
    search_fields = ("username", "email")
    ordering_fields = ("username",)

    def get_queryset(self):  # type: ignore
        company = get_user_company_from_request_or_raise(self.request)
        return CustomUser.objects.filter(company=company).order_by("-username")


@api_view(('GET',))
@permission_classes((IsAuthenticated,))
def me(request):
    return Response(CustomUserSerializer(request.user).data)
