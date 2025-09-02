import { RegexPattern } from "./regex";

String.prototype.toCapitalized = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.toPhone = function () {
  const cleaned = String(this).replace(/\D/g, "");
  const matches = cleaned.match(RegexPattern.PHONE);
  return matches
    ? `(${matches[2]}) ${matches[3]}-${matches[4]}`
    : "Invalid phone number";
};

String.prototype.toTitleCase = function (): string {
  return this.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
};

String.prototype.truncate = function (length?: number, append: string = "...") {
  if (!length) return this.toString();
  return `${this.slice(0, length)}${this.length > length ? append : ""}`;
};
