from datetime import date, datetime, time, timedelta
from dateutil.parser import parse


def parse_date(value: str | date) -> date:
    """Convert MM-DD-YYYY string to a date."""
    if isinstance(value, str):
        return parse(value).date()
    return value


def parse_time(value: str | time) -> time:
    """Parse a flexible time string into a time object."""
    if isinstance(value, str):
        return parse(value).time()
    return value


def get_week_start(value: str | date) -> date:
    """Return the Sunday that starts the week containing the date."""
    value = parse_date(value)
    return value - timedelta(days=(value.weekday() + 1) % 7)


def get_full_week(value: str | date) -> set[date]:
    week_start = get_week_start(value)
    return {week_start + timedelta(days=i) for i in range(7)}


def hours_between(start: str | time, end: str | time) -> float:
    """Return the number of hours between two times."""
    start_time = parse_time(start)
    end_time = parse_time(end)

    start_dt = datetime.combine(date.today(), start_time)
    end_dt = datetime.combine(date.today(), end_time)

    # Handle crossing midnight
    if end_dt < start_dt:
        end_dt += timedelta(days=1)

    return (end_dt - start_dt).total_seconds() / 3600
