import { describe, expect, it } from "vitest";
import { allPropertiesAreNull, uniqBy } from "../../core/helpers";

describe("allPropertiesAreNull", () => {
  it("returns true when every property is null or empty", () => {
    expect(allPropertiesAreNull({ a: null, b: "", c: undefined })).toBe(true);
  });

  it("returns false when at least one property has a value", () => {
    expect(allPropertiesAreNull({ a: null, b: "value" })).toBe(false);
  });
});

describe("uniqBy", () => {
  it("removes duplicate items by the given key", () => {
    const items = [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
      { id: 1, name: "A duplicate" },
    ];

    expect(uniqBy(items, "id")).toEqual([
      { id: 1, name: "A duplicate" },
      { id: 2, name: "B" },
    ]);
  });
});
