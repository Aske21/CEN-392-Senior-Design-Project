import { describe, expect, it } from "vitest";
import {
  buildProductFiltersSearchParams,
  buildProductsHref,
  parseProductFiltersFromSearchParams,
} from "./product-filters-url";

describe("parseProductFiltersFromSearchParams", () => {
  it("parses valid filter params", () => {
    const params = new URLSearchParams(
      "categoryId=3&search=phone&sortBy=price&sortOrder=desc&minPrice=10&maxPrice=100&page=2",
    );

    expect(parseProductFiltersFromSearchParams(params)).toEqual({
      categoryId: 3,
      search: "phone",
      sortBy: "price",
      sortOrder: "desc",
      minPrice: 10,
      maxPrice: 100,
      page: 2,
    });
  });

  it("ignores invalid numeric and sort values", () => {
    const params = new URLSearchParams(
      "categoryId=abc&sortBy=invalid&sortOrder=up&minPrice=NaN",
    );

    expect(parseProductFiltersFromSearchParams(params)).toEqual({});
  });
});

describe("buildProductFiltersSearchParams", () => {
  it("serializes filters and trims search text", () => {
    const params = buildProductFiltersSearchParams({
      categoryId: 5,
      search: "  laptop  ",
      sortBy: "name",
      sortOrder: "asc",
      minPrice: 0,
      maxPrice: 500,
      page: 3,
    });

    expect(params.get("categoryId")).toBe("5");
    expect(params.get("search")).toBe("laptop");
    expect(params.get("sortBy")).toBe("name");
    expect(params.get("sortOrder")).toBe("asc");
    expect(params.get("minPrice")).toBe("0");
    expect(params.get("maxPrice")).toBe("500");
    expect(params.get("page")).toBe("3");
  });

  it("omits page when it is 1 or less", () => {
    const params = buildProductFiltersSearchParams({ page: 1 });

    expect(params.has("page")).toBe(false);
  });
});

describe("buildProductsHref", () => {
  it("builds a locale-aware products URL with query string", () => {
    expect(
      buildProductsHref("en", {
        search: "watch",
        sortBy: "price",
        sortOrder: "asc",
      }),
    ).toBe("/en/products?search=watch&sortBy=price&sortOrder=asc");
  });

  it("builds a products URL without query when no filters apply", () => {
    expect(buildProductsHref("de")).toBe("/de/products");
  });
});
