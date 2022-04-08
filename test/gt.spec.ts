import { filter, gt, pipe, toArray } from "../src/index";

describe("gt(greater)", function () {
  it("given array then should return greater values", function () {
    const result = pipe([4, 5, 6], filter(gt(5)), toArray);
    expect(result).toEqual([6]);
  });
  it("given array then should return empty array", function () {
    const result = pipe([5, 6, 7], filter(gt(7)), toArray);
    expect(result).toEqual([]);
  });

  it("given string array then should return [c, d, e]", function () {
    const result = pipe(["a", "b", "c", "d", "e"], filter(gt("c")), toArray);
    expect(result).toEqual(["d", "e"]);
  });
  it("given string array then should return empty array", function () {
    const result = pipe(["a", "b", "c", "d"], filter(gt("d")), toArray);
    expect(result).toEqual([]);
  });
});
