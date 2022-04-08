import { filter, gte, pipe, toArray } from "../src/index";

describe("gte(greater or equal)", function () {
  it("given array then should return greater values", function () {
    const result = pipe([4, 5, 6], filter(gte(5)), toArray);
    expect(result).toEqual([5, 6]);
  });
  it("given array then should return empty array", function () {
    const result = pipe([5, 6, 7], filter(gte(8)), toArray);
    expect(result).toEqual([]);
  });

  it("given string array then should return [c, d, e]", function () {
    const result = pipe(["a", "b", "c", "d", "e"], filter(gte("c")), toArray);
    expect(result).toEqual(["c", "d", "e"]);
  });
  it("given string array then should return empty array", function () {
    const result = pipe(["a", "b", "c", "d"], filter(gte("e")), toArray);
    expect(result).toEqual([]);
  });
});
