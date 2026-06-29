import { z } from "zod";
import { historyEntrySchema } from "../schemas/basic";

export type THistoryEntry = z.infer<typeof historyEntrySchema>;
