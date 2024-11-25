import {
  capitalize,
  checkIsAbsoluteUrl,
  checkIsNonNullable,
  formatCurrency,
  normalizeString,
  removeSearchQuery,
} from "../utils";

describe("capitalize", () => {
  it("should capitalize the first letter of a string", () => {
    expect(capitalize("hello")).toBe("Hello");
  });
});

describe("formatCurrency", () => {
  it("should format a number as currency", () => {
    expect(formatCurrency(123456)).toBe("123 456,00 €");
  });
});

describe("normalizeString", () => {
  it("should return the original string without changes", () => {
    expect(normalizeString("  Hello  ")).toBe("  Hello  ");
  });

  it("should remove accents from a string", () => {
    expect(normalizeString("éà")).toBe("ea");
  });
});

describe("removeSearchQuery", () => {
  it("should remove the search query from a url", () => {
    expect(
      removeSearchQuery(
        "https://en.wikipedia.org/wiki/Software_development?search=software#Hello",
      ),
    ).toBe("https://en.wikipedia.org/wiki/Software_development");
  });
});

describe("checkIsNonNullable", () => {
  it("should return true if the value is not null", () => {
    expect(checkIsNonNullable("value")).toBe(true);
  });

  it("should return false if the value is null", () => {
    expect(checkIsNonNullable(null)).toBe(false);
  });
});

describe("checkIsAbsoluteUrl", () => {
  it("should return true if the url is absolute", () => {
    expect(checkIsAbsoluteUrl("https://example.com")).toBe(true);
  });

  it("should return false if the url is not absolute", () => {
    expect(checkIsAbsoluteUrl("/relative")).toBe(false);
  });

  it("should return false if the url is invalid", () => {
    expect(checkIsAbsoluteUrl("./absolute")).toBe(false);
  });
});
