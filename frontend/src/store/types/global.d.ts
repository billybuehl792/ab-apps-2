import { type ReactNode } from "react";
import { type LinkOptions } from "@tanstack/react-router";

declare global {
  type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
    T,
    Exclude<keyof T, Keys>
  > &
    {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

  type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
    T,
    Exclude<keyof T, Keys>
  > &
    {
      [K in Keys]-?: Required<Pick<T, K>> &
        Partial<Record<Exclude<Keys, K>, undefined>>;
    }[Keys];

  interface MenuOption<T = string> {
    id: T;
    render?: boolean;
    label: string;
    icon?: ReactNode;
    description?: ReactNode;
    disabled?: boolean;
    selected?: boolean;
    color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
    tooltip?: ReactNode;
    disableCloseOnSelect?: boolean;
    onClick?: VoidFunction;
  }

  interface ListItem
    extends Omit<MenuOption, "color" | "disableCloseOnSelect"> {
    link?: LinkOptions;
    expanded?: boolean;
    items?: ListItem[];
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
