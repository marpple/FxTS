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
    it("given date array then should return date array", function () {
      const result = pipe(
        [new Date(2022, 4, 10), new Date(2022, 3, 9), new Date(2022, 3, 10)],
        filter(lte(new Date(2022, 3, 10))),
        toArray,
      );

      expect(result).toEqual([new Date(2022, 3, 9), new Date(2022, 3, 10)]);
    });

    it("given data array then should return empty array", function () {
      const result = pipe(
        [new Date(2021, 4, 10), new Date(2021, 3, 9)],
        filter(lte(new Date(4, 11))),
        toArray,
      );

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
    it("should return true that the first Date is less than second", function () {
      expect(lte(new Date(2021, 4, 11), new Date())).toEqual(true);
    });
    it("should return true that the first Date is equal to second", function () {
      expect(lte(new Date(2021, 4, 11), new Date(2021, 4, 11))).toEqual(true);
    });

    it("should return false that the first Date is not less than second", function () {
      expect(lte(new Date(), new Date(2021, 4, 11))).toEqual(false);
    });
  });
});
