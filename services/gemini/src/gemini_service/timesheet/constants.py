from .settings import timesheet_settings

TIMESHEET_EMPLOYEES = timesheet_settings.employees

TIMESHEET_EXTRACTION_PROMPT = f"""
Extract timesheet information from the provided image.

Treat the image as one separate timesheet sheet.

Rules:

General:

- Do not include Markdown, explanations, comments, or additional fields.
- Preserve the exact JSON structure.
- If the image does not contain readable timesheet information, set "valid" to false and omit "data".
- If the timesheet is readable but some information is missing, set "valid" to true and use appropriate empty/default values.
- Do not create duplicate entries unless the same entry genuinely appears more than once.

valid:

- Must be a boolean.
- Set to true if valid timesheet information can be extracted from the image.
- Set to false if the image is blank, unreadable, unrelated, or does not contain timesheet information.

data:

- Must be omitted when "valid" is false.
- Must be included when "valid" is true.
- Contains information for the overall timesheet as well as individual work entries.

name:

- Must be exactly one of the following employee names: {TIMESHEET_EMPLOYEES}.
- Extract the timesheet owner's name written at the top of the page.
- The written name may be a first name only, a full name, or an abbreviated name.
- If only a first name is provided, match it to the employee with that first name.
- If multiple employees have the same first name and the employee cannot be determined reliably, return an invalid result rather than guessing.
- If a full name is provided, match it to the corresponding employee.
- If the name cannot be reasonably determined, return an empty string, otherwise return the exact full employee name from ${TIMESHEET_EMPLOYEES}.

date:

- Must be a string.
- Format exactly as MM-DD-YYYY.
- Include leading zeros for month and day.
- Example: "08-02-2026".
- Convert other date formats into this format when possible.
- Return an empty string if the date cannot be determined.

Sheet-level startTime:

- Represents the overall start time recorded for the timesheet/workday.
- This is NOT necessarily the start time of the first entry.
- Prioritize the start time shown in the overall timesheet, header, or employee time section.
- Do not derive this value from an entry unless the timesheet explicitly indicates that they are the same.
- Format exactly as HH:MM using 24-hour time.
- Use 24-hour time and do not include AM/PM.
- Generally infer startTime to be AM.
- If no startTime discernable from the header, use the earliest startTime of the earliest entry
- Return an empty string if the overall start time cannot be determined.

Sheet-level endTime:

- Represents the overall end time recorded for the timesheet/workday.
- This is NOT necessarily the end time of the last entry.
- Use the end time shown in the overall timesheet, header, or employee time section.
- Do not derive this value from an entry unless the timesheet explicitly indicates that they are the same.
- Format exactly as HH:MM using 24-hour time.
- Use 24-hour time and do not include AM/PM.
- Generally infer endTime to be PM.
- If no endTime is discernable from the header, use the latest endTime of the latest entry
- Return an empty string if the overall end time cannot be determined.

entries:

- Must be an array.
- Include one object per individual work/job entry found in the image.
- Preserve chronological order when possible.
- Do not include entries that cannot reasonably be identified as timesheet entries.
- Entry times are independent of the sheet-level startTime and endTime.
- Do NOT assume the first entry's startTime equals the sheet startTime.
- Do NOT assume the last entry's endTime equals the sheet endTime.

Entry address:

- Must be a string.
- Return a normalized US street address.
- Format: "Street Address, City, State ZIP".
- Example: "1234 Main Rd, Hometown, OH 44000".
- Use standard postal abbreviations for states.
- Normalize common street abbreviations:
- Road -> Rd
- Street -> St
- Avenue -> Ave
- Boulevard -> Blvd
- Include city, state, and ZIP code when available.
- If only partial address information is visible, return the normalized partial address.
- Return an empty string if no address is present.

Entry description:

- Must be a string.
- Extract the work description or job notes for the individual entry.
- Preserve important details.
- Return an empty string if unavailable.

Entry startTime:

- Must be a string.
- Represents the start time of the individual work/job entry.
- This is independent of the sheet-level startTime.
- Format exactly as HH:MM using 24-hour time.
- Do not include AM/PM.
- Examples:
- 8:30 AM -> "08:30"
- 4:45 PM -> "16:45"
- Return an empty string if the entry start time cannot be determined.

Entry endTime:

- Must be a string.
- Represents the end time of the individual work/job entry.
- This is independent of the sheet-level endTime.
- Format exactly as HH:MM using 24-hour time.
- Do not include AM/PM.
- Return an empty string if the entry end time cannot be determined.
"""
