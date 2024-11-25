import type { typeToFlattenedError } from "zod";
import { z } from "zod";

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}


export function removeSearchQuery(url: string) {
  const parsedUrl = new URL(url);
  return `${parsedUrl.origin}${parsedUrl.pathname}`;
}

export function formatCurrency(
  number: number,
  options?: Intl.NumberFormatOptions,
) {
  // TODO: use user's locale
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    ...options,
  }).format(number);
}

/** Utility to remove accents and diacritics from a string of text */
export function normalizeString(input: string): string {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function checkHasZodError<T>(
  data: unknown,
): data is { zodError: typeToFlattenedError<T> } {
  return (
    data instanceof Object &&
    "zodError" in data &&
    data?.zodError instanceof Object &&
    "fieldErrors" in data.zodError &&
    data.zodError.fieldErrors instanceof Object
  );
}

export function getFirstLetter(text: string | null | undefined): string {
  return text ? text.charAt(0) : "";
}

const emailValidator = z.string().email();

export function checkIsValidEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return emailValidator.safeParse(email).success;
}

/**
 * Filter non-nullable values while keeping TypeScript happy
 * Usage: `array.filter(isNonNullable)`
 * */
export function checkIsNonNullable<T>(value?: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// From: https://stackoverflow.com/a/19709846/1232796
const absoluteRegExp = new RegExp("^(?:[a-z+]+:)?//", "i");

/** Return true if the URL is absolute. */
export function checkIsAbsoluteUrl(url: string): boolean {
  return absoluteRegExp.test(url);
}
