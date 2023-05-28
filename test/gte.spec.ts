import { filter, gte, pipe, toArray } from "../src";

describe("gte(greater then or equal to)", function () {
  describe("currying", function () {
    it("given array then should return greater values", function () {
      const result = pipe([4, 5, 6], filter(gte(5)), toArray);
      expect(result).toEqual([4, 5]);
    });
    it("given array then should return empty array", function () {
      const result = pipe([5, 6, 7], filter(gte(4)), toArray);
      expect(result).toEqual([]);
    });

    it("given string array then should return [a, b, c]", function () {
      const result = pipe(["a", "b", "c", "d", "e"], filter(gte("c")), toArray);
      expect(result).toEqual(["a", "b", "c"]);
    });
    it("given string array then should return empty array", function () {
      const result = pipe(["b", "c", "d"], filter(gte("a")), toArray);
      expect(result).toEqual([]);
    });
    it("given date array then should return date array", function () {
      const result = pipe(
        [new Date(2022, 4, 10), new Date(2022, 3, 9), new Date(2022, 4, 11)],
        filter(gte(new Date(2022, 4, 10))),
        toArray,
      );

      expect(result).toEqual([new Date(2022, 4, 10), new Date(2022, 3, 9)]);
    });

    it("given data array then should return empty array", function () {
      const result = pipe(
        [new Date(2021, 4, 10), new Date(2021, 3, 9)],
        filter(gte(new Date(2020, 4, 10))),
        toArray,
      );

      expect(result).toEqual([]);
    });
  });

  describe("eager evaluation", function () {
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
    it("should return true that the first Date is less than second", function () {
      expect(gte(new Date(), new Date(2021, 4, 11))).toEqual(true);
    });
    it("should return true that the first Date is equal to second", function () {
      expect(gte(new Date(2021, 4, 11), new Date(2021, 4, 11))).toEqual(true);
    });
    it("should return false that the first Date is not less than second", function () {
      expect(gte(new Date(2021, 4, 11), new Date())).toEqual(false);
    });
  });
});
