from django.db import models

from app.common.models import TimeStampedModel


class Job(TimeStampedModel):
    label = models.CharField(max_length=255, blank=True, default="")
    description = models.TextField(blank=True, default="")
    assignee = models.ForeignKey(
        "contacts.Contact", blank=True, null=True, on_delete=models.SET_NULL, related_name="jobs_assignee")
    recipient = models.ForeignKey(
        "contacts.Contact", blank=True, null=True, on_delete=models.SET_NULL, related_name="jobs_recipient")
    place = models.ForeignKey(
        "places.Place", blank=True, null=True, on_delete=models.SET_NULL, related_name="jobs")
    scheduled_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:  # type: ignore
        verbose_name = "Job"
        verbose_name_plural = "Jobs"

    def __str__(self):
        return self.label
