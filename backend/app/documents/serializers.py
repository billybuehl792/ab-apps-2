from rest_framework import serializers

from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for reading Document model excluding company field."""

    class Meta:
        model = Document
        fields = ("id", "label", "description", "file", "thumbnail", "original_filename",
                  "mime_type", "uploaded_by", "created_at", "updated_at")
        read_only_fields = fields


class DocumentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Document model excluding company field."""

    class Meta:
        model = Document
        fields = ("label", "description", "file")
        extra_kwargs = {
            'file': {'required': True}
        }


class DocumentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating Document model excluding company field."""

    class Meta:
        model = Document
        fields = ("label", "description")
