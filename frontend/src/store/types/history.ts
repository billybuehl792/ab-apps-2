import { z } from "zod";
import { historyEntrySchema } from "../schemas/history";

export type THistoryEntry = z.infer<typeof historyEntrySchema>;
