import { z, type ZodObject } from "zod";
import type { SearchMiddleware } from "@tanstack/react-router";

/**
 * Middleware to sanitize search params using a Zod schema. It attempts to parse each param with the corresponding Zod validator, and only includes valid params in the final search object. This is useful to prevent invalid or unexpected values from causing issues in components that consume the search params.
 *
 * @param schema - A Zod object schema defining the expected shape of the search params.
 * @returns A SearchMiddleware function that can be used in route definitions.
 */
const sanitizeSearchParams = <TSchema extends ZodObject>(
  schema: TSchema,
): SearchMiddleware<z.output<TSchema>> => {
  return ({ search, next }) => {
    const cleaned: Record<string, unknown> = {};

    for (const [key, validator] of Object.entries(schema.shape)) {
      const result = validator.safeParse(search[key]);
      if (result.success) cleaned[key] = result.data;
    }

    const parsed = schema.parse(cleaned);

    return next(parsed);
  };
};

export default sanitizeSearchParams;
