# client.py

from pathlib import Path
from google import genai
from pydantic import BaseModel
from typing import TypeVar
import mimetypes
from .settings import settings


T = TypeVar("T", bound=BaseModel)


class GeminiClient:
    def __init__(self):
        self.client = genai.Client(api_key=settings.gemini_api_key)

    def parse_image(
        self,
        file: Path,
        prompt: str,
        schema: type[T],
    ) -> T:
        mime_type, _ = mimetypes.guess_type(file)
        is_image = mime_type and mime_type.startswith("image/")

        if not is_image:
            raise ValueError("File must be an image.")

        image = self.client.files.upload(file=file)
        chat = self.client.chats.create(
            model=settings.gemini_model,
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=schema,
            ),
        )

        response = chat.send_message([image, prompt])

        return schema.model_validate_json(response.text or "{}")
