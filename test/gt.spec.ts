import { filter, gt, pipe, toArray } from "../src/index";

describe("gt(greater)", function () {
  describe("gt given curry", function () {
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

  describe("gt given boolean", function () {
    it("given two number should return true", function () {
      expect(gt(5, 1)).toEqual(true);
    });
    it("given two number should return false", function () {
      expect(gt(1, 5)).toEqual(false);
    });

    it("given two char should return true", function () {
      expect(gt("b", "a")).toEqual(true);
    });
    it("given two char should return false", function () {
      expect(gt("b", "c")).toEqual(false);
    });
  });
});
