import { z } from "zod";
import {
  contactSchema,
  contactUpdateSchema,
  contactUploadFileSchema,
} from "./schemas";

export type TContact = z.infer<typeof contactSchema>;

export type TContactUpdate = z.infer<typeof contactUpdateSchema>;

export type TContactUploadFile = z.infer<typeof contactUploadFileSchema>;
