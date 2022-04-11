import { filter, gt, pipe, toArray } from "../src/index";

describe("gt(greater)", function () {
  describe("should return curry", function () {
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
    it("given date array then should return date array", function () {
      const result = pipe(
        [new Date(2022, 4, 10), new Date(2022, 3, 9)],
        filter(gt(new Date(2022, 3, 10))),
        toArray,
      );

      expect(result).toEqual([new Date(2022, 4, 10)]);
    });

    it("given data array then should return empty array", function () {
      const result = pipe(
        [new Date(2021, 4, 10), new Date(2021, 3, 9)],
        filter(gt(new Date())),
        toArray,
      );

      expect(result).toEqual([]);
    });
  });

  describe("should return boolean", function () {
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
