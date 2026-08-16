import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    gemini_api_key: str
    gemini_model: str


settings = Settings(
    gemini_api_key=os.getenv("GEMINI_API_KEY") or "",
    gemini_model=os.getenv("GEMINI_MODEL") or "gemini-3.5-flash-lite",
)
