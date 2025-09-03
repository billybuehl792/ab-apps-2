import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";

// https://day.js.org/docs/en/plugin/plugin

dayjs.extend(isToday);
dayjs.extend(relativeTime);
