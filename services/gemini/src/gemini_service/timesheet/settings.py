import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


DEFAULT_OVERTIME_THRESHOLD = 40


@dataclass(frozen=True)
class TimesheetSettings:
    employees: str
    overtime_threshold: float


timesheet_settings = TimesheetSettings(
    employees=os.getenv("TIMESHEET_EMPLOYEES") or "",
    overtime_threshold=float(
        os.getenv("TIMESHEET_OVERTIME_THRESHOLD") or DEFAULT_OVERTIME_THRESHOLD)
)
