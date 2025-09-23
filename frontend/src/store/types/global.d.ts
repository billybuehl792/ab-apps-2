import { type ReactNode } from "react";
import { type LinkOptions } from "@tanstack/react-router";

declare global {
  /**
   * Creates a type that requires at least one of the specified properties to be present.
   * All specified keys become required in at least one variant, while other properties remain unchanged.
   *
   * @template T - The original type to transform
   * @template K - The keys from T where at least one must be provided
   *
   */
  type RequireAtLeastOne<T, K extends keyof T> = Omit<T, K> &
    {
      [P in K]-?: Required<Pick<T, P>> & Partial<Pick<T, Exclude<K, P>>>;
    }[K];

  /**
   * Creates a union type that requires exactly one of the two specified properties to be present.
   * The selected property becomes required while the other becomes explicitly undefined.
   * All other properties from the original type remain unchanged.
   *
   * @template T - The original type to transform
   * @template K1 - The first key that could be required
   * @template K2 - The second key that could be required
   */
  type RequireOnlyOne<T, K1 extends keyof T, K2 extends keyof T> = Omit<
    T,
    K1 | K2
  > &
    (
      | (Required<Pick<T, K1>> & { [P in K2]?: undefined })
      | (Required<Pick<T, K2>> & { [P in K1]?: undefined })
    );

  /**
   * Creates a new type where all properties are optional except for the specified keys, which become required.
   *
   * @template T - The original type to transform
   * @template K - The keys from T that should be required (all other keys become optional)
   */
  type WithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

  interface MenuOption<T = string, C = VoidFunction> {
    id: T;
    render?: boolean;
    label: string;
    Icon?: SvgIconComponent;
    description?: ReactNode;
    disabled?: boolean;
    selected?: boolean;
    color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
    tooltip?: ReactNode;
    disableCloseOnSelect?: boolean;
    onClick?: C;
  }

  interface ListItem<T = string, I = ReactNode, C = VoidFunction>
    extends Omit<MenuOption<T, I, C>, "color" | "disableCloseOnSelect"> {
    link?: LinkOptions;
    expanded?: boolean;
    items?: ListItem<T, I, C>[];
  }

  interface String {
    /**
     * Capitalizes the first character of a string.
     *
     * @param string - The input string to be capitalized.
     * @returns A new string with the first character converted to uppercase, leaving the rest of the string unchanged.
     */
    toCapitalized(): string;

    /**
     * Converts a string to 'Phone Case' ex: `(123) 456-7890`
     *
     * @param string - The input string to be converted to phone case.
     * @returns A new string formatted as a phone number.
     */
    toPhone(): string;

    /**
     * Converts a string to 'Title Case', where the first character of each word is capitalized.
     *
     * @param string - The input string to be converted to title case.
     * @returns A new string with each word's first character capitalized.
     */
    toTitleCase(): string;

    /**
     * Truncates a string to a specified length and appends a custom suffix if the string exceeds that length.
     *
     * @param str - The input string to be truncated.
     * @param options - An object containing the truncation options.
     * @param options.length - The maximum length of the truncated string. If not provided, the original string is returned.
     * @param options.append - The string to append to the truncated string if truncation occurs. Defaults to "...".
     * @returns A new string truncated to the specified length with the suffix appended if truncation occurs, or the original string if no truncation is needed.
     */
    truncate(length?: number, append?: string): string;

    /**
     * Converts a 'snake_case' string to 'Title Case'.
     *
     * @param string - The input 'snake_case' string to be converted.
     * @returns A new string converted to 'Title Case'.
     */
    snakeCaseToTitleCase(): string;
  }

  interface Number {
    /**
     * Converts a string to 'USD Case', formatting it as a currency string in USD.
     *
     * @param string - The input string to be converted to USD case.
     * @returns A new string formatted as a currency in USD.
     */
    toUSD(): string;
  }
}
