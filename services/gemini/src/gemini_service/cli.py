import argparse
from dotenv import load_dotenv
from gemini_service.timesheet import Timesheet

load_dotenv()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "service", help="service name (e.g., extract_timesheet)")
    parser.add_argument("file", help="Path to the file")

    args = parser.parse_args()

    if args.service == "extract_timesheet":
        result = Timesheet.extract_from_json(file_path=args.file)

        ts = Timesheet([result])
        print(ts.get_timesheet_data())

        # result = Timesheet.extract_from_image(file_path=args.file)
        # print(result.model_dump_json(indent=4))


if __name__ == "__main__":
    main()
