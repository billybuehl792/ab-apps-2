import argparse
import json
from pathlib import Path
from .timesheet import Timesheet
from .timesheet.models import TimesheetModel


def extract_timesheet(path: Path):
    result = Timesheet.extract(path)
    for i in result:
        print(i.model_dump_json(indent=4))


def test(path: Path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    timesheets = [
        TimesheetModel.model_validate(item)
        for item in data
    ]

    ts = Timesheet(timesheets)
    report = ts.generate_report(path.parent)
    print(f"Report generated at {report.absolute()}")


# def generate_report(file: Path):
#     report = test(path)

#     Path(file).write_text(
#         report.model_dump_json(indent=2),
#         encoding="utf-8",
#     )

#     print(f"Report generated at {file.absolute}")


def main():
    parser = argparse.ArgumentParser()
    commands = parser.add_subparsers(dest="command", required=True)

    # extract
    extract = commands.add_parser("extract")
    extract.add_argument("path", type=Path)

    # test
    extract = commands.add_parser("test")
    extract.add_argument("path", type=Path)

    # validate
    validate = commands.add_parser("validate")
    validate.add_argument("--valid", action=argparse.BooleanOptionalAction)

    args = parser.parse_args()

    if args.command == "extract":
        extract_timesheet(args.path)

    elif args.command == "test":
        test(args.path)

    elif args.command == "validate":
        pass


if __name__ == "__main__":
    main()
