from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Document
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile
from pdf2image import convert_from_path
import tempfile
import os


@receiver(post_save, sender=Document)
def generate_thumbnail(sender, instance, created, **kwargs):
    if created and instance.file:
        try:
            instance.file.seek(0)
            if instance.mime_type.startswith('image'):
                img = Image.open(instance.file)
            elif instance.mime_type == 'application/pdf':
                with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_pdf:
                    tmp_pdf.write(instance.file.read())
                    tmp_pdf.flush()
                    images = convert_from_path(
                        tmp_pdf.name, first_page=1, last_page=1, size=(256, 256))
                    img = images[0]
                os.unlink(tmp_pdf.name)
            else:
                return

            img.thumbnail((256, 256))
            thumb_io = BytesIO()
            if img.mode in ("RGBA", "LA"):
                background = Image.new("RGB", img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1])
                img = background
            else:
                img = img.convert("RGB")
            img.save(thumb_io, format='JPEG')
            thumb_file = ContentFile(
                thumb_io.getvalue(), name=f"thumb_{instance.pk}.jpg")
            instance.thumbnail.save(thumb_file.name, thumb_file)
            instance.save(update_fields=['thumbnail'])
        except Exception as e:
            print(f"Thumbnail generation failed: {e}")


@receiver(post_delete, sender=Document)
def delete_files_on_document_delete(sender, instance, **kwargs):
    # Delete the main file
    if instance.file and instance.file.storage.exists(instance.file.name):
        instance.file.delete(save=False)
    # Delete the thumbnail
    if instance.thumbnail and instance.thumbnail.storage.exists(instance.thumbnail.name):
        instance.thumbnail.delete(save=False)
