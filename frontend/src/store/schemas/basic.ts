import z from "zod";

export const idSchema = z.coerce.number().int().positive();

export const objectSchema = z.object({
  id: idSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
});

export const nameSchema = z.coerce.string().min(1).max(100).trim();

export const emailSchema = z.coerce
  .string()
  .max(100, "Email must be at most 100 characters")
  .email("Invalid email address");

export const phoneSchema = z.coerce
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format");

export const truthySchema = z.coerce
  .boolean()
  .optional()
  .transform((val) => !!val || undefined)
  .catch(undefined);

export const idOrIdArraySchema = z
  .union([idSchema, z.array(idSchema)])
  .transform((val) => Array.from(new Set(Array.isArray(val) ? val : [val])))
  .pipe(z.array(idSchema).min(1))
  .catch([]);
