# client.py

from google import genai
from pydantic import BaseModel
from typing import TypeVar


T = TypeVar("T", bound=BaseModel)


class GeminiClient:
    def __init__(self):
        self.client = genai.Client()

    def parse_image(
        self,
        image_path: str,
        prompt: str,
        schema: type[T],
    ) -> T:
        image = self.client.files.upload(file=image_path)

        chat = self.client.chats.create(
            model="gemini-3.5-flash-lite",
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=schema,
            ),
        )

        response = chat.send_message([image, prompt])

        return schema.model_validate_json(response.text or "{}")
