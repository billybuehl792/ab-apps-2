from pydantic import BaseModel


class TimesheetEntryModel(BaseModel):
    address: str
    description: str
    startTime: str
    endTime: str


class TimesheetDataModel(BaseModel):
    date: str
    startTime: str
    endTime: str
    breaks: float
    entries: list[TimesheetEntryModel]


class TimesheetModel(BaseModel):
    valid: bool
    data: TimesheetDataModel
