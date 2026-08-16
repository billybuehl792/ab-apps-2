import argparse
from pathlib import Path
from .timesheet import Timesheet


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
        timesheets = Timesheet.extract(Path(args.path))
        ts = Timesheet(timesheets)

        if (args.output):
            output_dir = Path(args.output)

            if args.json:
                json_path = output_dir / "output.json"
                ts.create_json(json_path)

            if args.pdf:
                pdf_path = output_dir / "output.pdf"
                ts.create_pdf(pdf_path)


if __name__ == "__main__":
    main()
