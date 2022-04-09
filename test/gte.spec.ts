import { filter, gte, pipe, toArray } from "../src/index";

describe("gte(greater or equal)", function () {
  describe("should return curry", function () {
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

  describe("should return boolean", function () {
    it("should return true that the first number is greater than second", function () {
      expect(gte(5, 1)).toEqual(true);
    });
    it("should return true that the first number is equal to second", function () {
      expect(gte(5, 5)).toEqual(true);
    });
    it("should return false that the first number is not greater than or not equal to second", function () {
      expect(gte(1, 5)).toEqual(false);
    });

    it("should return true that the first char is greater than second", function () {
      expect(gte("b", "a")).toEqual(true);
    });
    it("should return true that the first char is equal to second", function () {
      expect(gte("b", "b")).toEqual(true);
    });

    it("should return false that the first char is not greater than or not equal to second", function () {
      expect(gte("b", "c")).toEqual(false);
    });
  });
});
