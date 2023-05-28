import { filter, gt, pipe, toArray } from "../src";

describe("gt(greater then)", function () {
  describe("currying", function () {
    it("given array then should return array with filtered values greater than 5", function () {
      const result = pipe([4, 5, 6], filter(gt(5)), toArray);
      expect(result).toEqual([4]);
    });
    it("given array then should return empty array", function () {
      const result = pipe([5, 6, 7], filter(gt(5)), toArray);
      expect(result).toEqual([]);
    });

    it("given string array then should return [a, b]", function () {
      const result = pipe(["a", "b", "c", "d", "e"], filter(gt("c")), toArray);
      expect(result).toEqual(["a", "b"]);
    });
    it("given string array then should return empty array", function () {
      const result = pipe(["a", "b", "c", "d"], filter(gt("a")), toArray);
      expect(result).toEqual([]);
    });
    it("given date array then should return date array", function () {
      const result = pipe(
        [new Date(2022, 4, 10), new Date(2022, 3, 9)],
        filter(gt(new Date(2022, 3, 10))),
        toArray,
      );

      expect(result).toEqual([new Date(2022, 3, 9)]);
    });

    it("given data array then should return empty array", function () {
      const result = pipe(
        [new Date(2021, 4, 10), new Date(2021, 3, 9)],
        filter(gt(new Date(2020, 9, 12))),
        toArray,
      );

      expect(result).toEqual([]);
    });
  });

  describe("eager evaluation", function () {
    it("should return true that the first number is greater than second", function () {
      expect(gt(5, 1)).toEqual(true);
    });
    it("should return false that the first number is not greater than second", function () {
      expect(gt(1, 5)).toEqual(false);
    });

    it("should return true that the first char is greater than second", function () {
      expect(gt("b", "a")).toEqual(true);
    });
    it("should return false that the first char is not greater than second", function () {
      expect(gt("b", "c")).toEqual(false);
    });

    it("should return true that the first Date is greater than second", function () {
      expect(gt(new Date(), new Date(2021, 4, 11))).toEqual(true);
    });
    it("should return false that the first Date is not greater than second", function () {
      expect(gt(new Date(2021, 4, 11), new Date())).toEqual(false);
    });
  });
});
