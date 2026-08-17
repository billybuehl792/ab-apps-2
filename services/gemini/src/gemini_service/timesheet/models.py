import datetime
from pydantic import BaseModel


class TimesheetEntryModel(BaseModel):
    address: str
    description: str
    start_time: str
    end_time: str


class TimesheetDataModel(BaseModel):
    name: str
    date: str
    start_time: str
    end_time: str
    entries: list[TimesheetEntryModel]


class TimesheetModel(BaseModel):
    valid: bool
    data: TimesheetDataModel


class TimesheetReportDayModel(BaseModel):
    total_time: float
    start_time: datetime.time | None
    end_time: datetime.time | None
    entries: list[TimesheetEntryModel]


class TimesheetReportWeekModel(BaseModel):
    name: str
    total_time: float
    overtime: float
    days: dict[datetime.date, TimesheetReportDayModel]


class TimesheetReportModel(BaseModel):
    weeks: dict[datetime.date, TimesheetReportWeekModel]
