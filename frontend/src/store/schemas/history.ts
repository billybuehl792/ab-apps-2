import { z } from "zod";
import { userSchema } from "./account";
import { idSchema } from "./basic";

export const historyEntrySchema = z.object({
  id: idSchema,
  user: userSchema.nullable(),
  action: z.enum(["Created", "Updated", "Deleted"]),
  history_date: z.iso.datetime(),
  changes: z.record(z.string(), z.tuple([z.unknown(), z.unknown()])),
});
