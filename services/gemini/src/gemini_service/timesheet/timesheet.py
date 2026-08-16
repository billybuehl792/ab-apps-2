import os
import json
from pathlib import Path
import mimetypes
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

from gemini_service.client import GeminiClient
from .models import TimesheetModel, TimesheetReportDayModel, TimesheetReportModel, TimesheetReportWeekModel
from .utils import get_full_week, get_week_start, hours_between, parse_date, parse_time
from .constants import TIMESHEET_EXTRACTION_PROMPT
from .settings import timesheet_settings


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

    def get_report(self):
        report = TimesheetReportModel(weeks={})
        for timesheet in self.timesheets:
            if not timesheet.valid:
                continue

            timesheet_date = parse_date(timesheet.data.date)
            week_start_date = get_week_start(timesheet_date)
            if week_start_date not in report.weeks:
                report.weeks[week_start_date] = TimesheetReportWeekModel(
                    total_time=0,
                    overtime=0,
                    days={day: TimesheetReportDayModel(
                        total_time=0, start_time=None, end_time=None, entries=[]) for day in get_full_week(week_start_date)}
                )

            week = report.weeks[week_start_date]
            day = week.days[timesheet_date]

            day.start_time = parse_time(timesheet.data.start_time)
            day.end_time = parse_time(timesheet.data.end_time)

            day.total_time = hours_between(
                timesheet.data.start_time, timesheet.data.end_time)
            day.entries.extend(timesheet.data.entries)
            week.total_time += day.total_time
            week.overtime = max(0, week.total_time -
                                timesheet_settings.overtime_threshold)

        return report

    def create_json(self, path: Path) -> Path:
        report = self.get_report()

        path.write_text(
            report.model_dump_json(indent=2),
            encoding="utf-8",
        )

        return path

    def create_pdf(self, path: Path) -> Path:
        report = self.get_report()

        document = SimpleDocTemplate(
            str(path),
            pagesize=letter,
            rightMargin=0.25 * inch,
            leftMargin=0.25 * inch,
            topMargin=0.25 * inch,
            bottomMargin=0.25 * inch,
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "Title",
            parent=styles["Title"],
            alignment=TA_CENTER,
            spaceAfter=20,
        )

        elements = []
        elements.append(Paragraph("Timesheet Report", title_style))

        for week_start, week in sorted(report.weeks.items()):
            elements.append(
                Paragraph(
                    f"Week of {week_start.strftime('%m/%d/%Y')}",
                    styles["Heading2"],
                )
            )

            data = [
                ["Date", "Start", "End", "Address, ""Description, ""Total Hours"]
            ]

            for day_date, day in sorted(week.days.items()):
                data.append([
                    day_date.strftime("%m/%d/%Y"),
                    day.start_time.strftime(
                        "%I:%M %p") if day.start_time else "",
                    day.end_time.strftime("%I:%M %p") if day.end_time else "",
                    "",
                    "",
                    f"{day.total_time:.2f}",
                ])

                for entry in day.entries:
                    entry_start_time = parse_time(entry.start_time)
                    entry_end_time = parse_time(entry.end_time)
                    total_entry_time = hours_between(
                        entry_start_time, entry_end_time)
                    data.append([
                        "",
                        entry_start_time.strftime("%I:%M %p"),
                        entry_end_time.strftime("%I:%M %p"),
                        entry.address,
                        entry.description,
                        f"{total_entry_time:.2f}",
                    ])

            table = Table(
                data,
                hAlign="LEFT",
                colWidths=[inch, inch, inch, inch * 2, inch * 2, inch * .75],
            )

            table.setStyle(
                TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                ])
            )

            elements.append(table)
            elements.append(Spacer(1, 15))

            elements.append(
                Paragraph(
                    f"Total Hours: {week.total_time:.2f} &nbsp;&nbsp; "
                    f"Overtime Hours: {week.overtime:.2f}",
                    styles["Normal"],
                )
            )

            elements.append(Spacer(1, 25))

        document.build(elements)

        return path

    @staticmethod
    def extract_from_json(file: Path) -> TimesheetModel:
        print(f"Extracting timesheet from json: {file.absolute()}")

        with open(file, "r", encoding="utf-8") as f:
            data = json.load(f)

        return TimesheetModel.model_validate(data)

    @staticmethod
    def extract_from_image(file: Path) -> TimesheetModel:
        print(f"Extracting timesheet from image: {file.absolute()}")

        client = GeminiClient()

        return client.parse_image(
            file,
            schema=TimesheetModel,
            prompt=TIMESHEET_EXTRACTION_PROMPT,
        )

    @staticmethod
    def extract_from_dir(path: Path, recursive=False) -> list[TimesheetModel]:
        if not path.is_dir():
            raise NotADirectoryError(f"Not a directory: {path}")

        print(f"Extracting timesheets in: {path.absolute()}")

        timesheets: list[TimesheetModel] = []
        for item in path.iterdir():
            if item.is_dir():
                if recursive:
                    timesheets.extend(Timesheet.extract_from_dir(item))
            else:
                timesheets.extend(Timesheet.extract(item))

        return timesheets

    @staticmethod
    def extract(path: Path) -> list[TimesheetModel]:
        if not path.exists():
            raise ValueError("Folder or file does not exist")

        if path.is_dir():
            return Timesheet.extract_from_dir(path)

        if path.is_file():
            mime_type, _ = mimetypes.guess_type(path)
            if not mime_type:
                raise ValueError("Could not discern file's mimetype")

            if mime_type.startswith("image/"):
                return [Timesheet.extract_from_image(path)]

            if mime_type.startswith("application/json"):
                return [Timesheet.extract_from_json(path)]

        return []
