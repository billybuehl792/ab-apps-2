from rest_framework import serializers

from .models import Place


class PlaceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Place
        exclude = ("company",)
        read_only_fields = (
            "id", "country", "state", "city", "postal_code",
            "address_full", "address_short", "latitude", "longitude",
        )
