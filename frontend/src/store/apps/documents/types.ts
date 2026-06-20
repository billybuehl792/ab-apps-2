import { z } from "zod";
import { documentSchema } from "./schemas";

export type TDocument = z.infer<typeof documentSchema>;
