export enum DateFormat {
  DATE = "M/D/YY", // 8/20/23
  DATE_ISO = "YYYY-MM-DD", // 2023-08-20
  DATE_MEDIUM = "MMM D, YYYY", // Mar 17, 1886
}

export enum TimeFormat {
  TIME = "h:mm", // 5:05
  TIME_ISO = "HH:mm:ss", // 17:05:23, 03:05:23
  TIME_MERIDIEM = "h:mm A", // 5:05 PM
  TIME_MILITARY = "HH:mm", // 17:05, 03:05
}

export enum DateTimeFormat {
  DATETIME = "M/D/YY h:mm", // 8/20/23 5:05
  DATETIME_ISO = "YYYY-MM-DD HH:mm:ss", // 2023-08-20T17:05:23, 2023-08-20T03:05:23
  DATETIME_MERIDIEM = "M/D/YY h:mm A", // 8/20/23 5:05 PM
  DATETIME_MILITARY = "M/D/YY HH:mm", // 8/20/23 17:05, 8/20/23 03:05
}
