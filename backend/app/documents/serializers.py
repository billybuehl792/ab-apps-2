from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers

from app.contacts.models import Contact
from app.jobs.models import Job

from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    contact = serializers.PrimaryKeyRelatedField(
        queryset=Contact.objects.all(),
        write_only=True,
        required=False,
    )
    job = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Document
        fields = ("id", "label", "description", "file", "thumbnail", "original_filename",
                  "mime_type", "uploaded_by", "created_at", "updated_at", "contact", "job")
        read_only_fields = ("id", "thumbnail", "original_filename", "mime_type",
                            "uploaded_by", "created_at", "updated_at")
        extra_kwargs = {
            'file': {'required': True}
        }

    def validate(self, attrs):
        attrs = super().validate(attrs)

        if attrs.get("contact") and attrs.get("job"):
            raise serializers.ValidationError({
                "non_field_errors": ["Provide either contact or job, not both."],
            })

        return attrs

    def _apply_content_object(self, validated_data):
        contact = validated_data.pop("contact", None)
        job = validated_data.pop("job", None)

        if contact is not None:
            validated_data["content_type"] = ContentType.objects.get_for_model(
                Contact)
            validated_data["object_id"] = contact.pk
        elif job is not None:
            validated_data["content_type"] = ContentType.objects.get_for_model(
                Job)
            validated_data["object_id"] = job.pk

        return validated_data

    def create(self, validated_data):
        validated_data = self._apply_content_object(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._apply_content_object(validated_data)
        return super().update(instance, validated_data)

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if request and request.method in ('PUT', 'PATCH'):
            fields['file'].read_only = True
            fields['file'].required = False
        return fields
