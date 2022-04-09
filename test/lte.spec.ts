import { filter, lte, pipe, toArray } from "../src/index";

describe("lte(little or equal)", function () {
  describe("lte given curry", function () {
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

  describe("lte given boolean", function () {
    it("should return true that the first number is less than second", function () {
      expect(lte(1, 5)).toEqual(true);
    });
    it("should return true that the first number is equal to second", function () {
      expect(lte(5, 5)).toEqual(true);
    });
    it("should return false that the first number is not less than or not equal to second", function () {
      expect(lte(5, 1)).toEqual(false);
    });

    it("should return true that the first char is less to second", function () {
      expect(lte("a", "b")).toEqual(true);
    });
    it("should return true that the first char is equal to second", function () {
      expect(lte("b", "b")).toEqual(true);
    });

    it("should return false that the first char is not less than or not equal to second", function () {
      expect(lte("c", "b")).toEqual(false);
    });
  });
});
