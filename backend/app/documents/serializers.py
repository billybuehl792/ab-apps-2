from rest_framework import serializers

from .models import Document


class DocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Document
        fields = ("id", "label", "description", "file", "thumbnail", "original_filename",
                  "mime_type", "uploaded_by", "created_at", "updated_at")
        read_only_fields = ("id", "thumbnail", "original_filename", "mime_type",
                            "uploaded_by", "created_at", "updated_at")
        extra_kwargs = {
            'file': {'required': True}
        }

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if request and request.method in ('PUT', 'PATCH'):
            fields['file'].read_only = True
            fields['file'].required = False
        return fields
