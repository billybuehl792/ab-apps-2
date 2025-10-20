/**
 * Deeply sanitizes an object by removing `null` and `undefined` values.
 * @param obj The object to sanitize.
 * @returns A new object with `null` and `undefined` values removed.
 */
const deepSanitizeObject = <T extends object>(obj?: T): T =>
  Object.entries(obj ?? {}).reduce((acc, [key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      !(Array.isArray(value) && !value.length)
    ) {
      // Recursively sanitize nested objects
      if (typeof value === "object" && !Array.isArray(value))
        (acc as Record<string, unknown>)[key] = deepSanitizeObject(
          value as object
        );
      else (acc as Record<string, unknown>)[key] = value;
    }
    return acc;
  }, {} as T);

export const objectUtils = {
  deepSanitizeObject,
};
