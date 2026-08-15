import json
from gemini_service.client import GeminiClient
from .models import TimesheetModel


class Timesheet:
    def __init__(self, timesheets: list[TimesheetModel] = []):
        self.timesheets = timesheets

    def append_timesheet(self, timesheet: TimesheetModel):
        self.timesheets.append(timesheet)

    def get_timesheet_data(self):
        sheets = []
        for timesheet in self.timesheets:
            sheets.append(timesheet.model_dump())

        return sheets

    @staticmethod
    def extract_from_json(file_path: str) -> TimesheetModel:
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        return TimesheetModel.model_validate(data)

    @staticmethod
    def extract_from_image(file_path: str) -> TimesheetModel:
        client = GeminiClient()

        return client.parse_image(
            image_path=file_path,
            schema=TimesheetModel,
            prompt="Extract the timesheet information from this image.",
        )
