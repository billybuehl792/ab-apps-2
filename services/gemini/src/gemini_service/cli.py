import json
import argparse
from pathlib import Path

from .timesheet import Timesheet
from .timesheet.models import TimesheetModel


def test():
    root_path = Path(__file__).parent.parent.parent
    output_file_path = root_path / "test_output" / "output.json"

    with open(output_file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    timesheets: list[TimesheetModel] = []
    for timesheet in data['raw']:
        timesheets.append(TimesheetModel.model_validate(timesheet))

    ts = Timesheet(timesheets)
    ts.create_pdf(Path(root_path / "test_output" / "output2.pdf"))
    print(ts.get_report().model_dump_json(indent=2))


def main():
    parser = argparse.ArgumentParser()
    commands = parser.add_subparsers(dest="command", required=True)

    # extract
    extract = commands.add_parser("extract")
    extract.add_argument("path", type=Path)
    extract.add_argument("--output", "-o", type=Path, default=Path.cwd())
    extract.add_argument("--json", action="store_true")
    extract.add_argument("--pdf", action="store_true")

    args = parser.parse_args()

    if args.command == "extract":
        input_path = Path(args.path)

        timesheets = Timesheet.extract(input_path)
        ts = Timesheet(timesheets)

        if (args.output):
            output_dir = Path(args.output)

            if args.json:
                json_path = output_dir / "output.json"
                ts.create_json(json_path)

            if args.pdf:
                pdf_path = output_dir / "output.pdf"
                ts.create_pdf(pdf_path)
        else:
            print(ts.get_report().model_dump_json(indent=2))


if __name__ == "__main__":
    main()
