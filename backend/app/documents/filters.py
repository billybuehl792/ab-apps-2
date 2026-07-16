from django.contrib.contenttypes.models import ContentType
from django_filters import FilterSet, NumberFilter

from app.contacts.models import Contact
from app.jobs.models import Job

from .models import Document


class DocumentsFilter(FilterSet):
    """Filter set for `Document` model, including generic relation filtering."""

    contact = NumberFilter(method="filter_contact")
    job = NumberFilter(method="filter_job")

    class Meta:
        model = Document
        fields = ("contact", "job")

    def filter_contact(self, queryset, name, value):
        contact_type = ContentType.objects.get_for_model(Contact)
        return queryset.filter(content_type_id=contact_type.id, object_id=value)

    def filter_job(self, queryset, name, value):
        job_type = ContentType.objects.get_for_model(Job)
        return queryset.filter(content_type_id=job_type.id, object_id=value)
