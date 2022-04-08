import { filter, lte, pipe, toArray } from "../src/index";

describe("lte(little or equal)", function () {
  it("given array then should return little values", function () {
    const result = pipe([4, 5, 6], filter(lte(5)), toArray);
    expect(result).toEqual([4, 5]);
  });
  it("given array then should return empty array", function () {
    const result = pipe([6, 7], filter(lte(5)), toArray);
    expect(result).toEqual([]);
  });

  it("given string array then should return [a, b, c]", function () {
    const result = pipe(["a", "b", "c", "d", "e"], filter(lte("d")), toArray);
    expect(result).toEqual(["a", "b", "c", "d"]);
  });
  it("given string array then should return empty array", function () {
    const result = pipe(["b", "c", "d"], filter(lte("a")), toArray);
    expect(result).toEqual([]);
  });
});
