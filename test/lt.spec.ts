import { filter, lt, pipe, toArray } from "../src";

describe("lt(less then)", function () {
  describe("currying", function () {
    it("given array then should return little values", function () {
      const result = pipe([4, 5, 6], filter(lt(5)), toArray);
      expect(result).toEqual([6]);
    });
    it("given array then should return empty array", function () {
      const result = pipe([5, 6, 7], filter(lt(7)), toArray);
      expect(result).toEqual([]);
    });

    it("given string array then should return [e]", function () {
      const result = pipe(["a", "b", "c", "d", "e"], filter(lt("d")), toArray);
      expect(result).toEqual(["e"]);
    });
    it("given string array then should return empty array", function () {
      const result = pipe(["a", "b", "c", "d"], filter(lt("d")), toArray);
      expect(result).toEqual([]);
    });
    it("given date array then should return date array", function () {
      const result = pipe(
        [new Date(2022, 4, 10), new Date(2022, 3, 9)],
        filter(lt(new Date(2022, 3, 10))),
        toArray,
      );

      expect(result).toEqual([new Date(2022, 4, 10)]);
    });

    it("given data array then should return empty array", function () {
      const result = pipe(
        [new Date(2021, 4, 10), new Date(2021, 3, 9)],
        filter(lt(new Date())),
        toArray,
      );

      expect(result).toEqual([]);
    });
  });
  describe("eager evaluation", function () {
    it("should return true that the first number is less than second", function () {
      expect(lt(1, 5)).toEqual(true);
    });
    it("should return false that the first number is not less than second", function () {
      expect(lt(5, 1)).toEqual(false);
    });

    it("should return true that the first char is less than second", function () {
      expect(lt("a", "b")).toEqual(true);
    });
    it("should return false that the first char is not less than second", function () {
      expect(lt("c", "b")).toEqual(false);
    });
    it("should return true that the first Date is less than second", function () {
      expect(lt(new Date(2021, 4, 11), new Date())).toEqual(true);
    });
    it("should return false that the first Date is not less than second", function () {
      expect(lt(new Date(), new Date(2021, 4, 11))).toEqual(false);
    });
  });
});
