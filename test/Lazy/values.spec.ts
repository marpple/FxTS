import { values } from "../../src";

describe("values", function () {
  describe("Object support", function () {
    it("should return an iterator that iterates values of the given object's property", function () {
      const obj = {
        a: 1,
        b: "2",
        c: true,
        d: null,
        e: undefined,
      };
      const iter = values(obj);
      expect(iter.next().value).toEqual(1);
      const res = [...iter];
      expect(res).toEqual(["2", true, null, undefined]);
    });
  });

  describe("Map support", function () {
    it("should return values from Map", function () {
      const map = new Map([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);
      const res = [...values(map)];
      expect(res).toEqual([1, 2, 3]);
    });

    it("should handle empty Map", function () {
      const map = new Map();
      const res = [...values(map)];
      expect(res).toEqual([]);
    });

    it("should preserve Map value types", function () {
      const map = new Map<string, number>([
        ["a", 1],
        ["b", 2],
      ]);
      const res = [...values(map)];
      expect(res).toEqual([1, 2]);
    });
  });

  describe("Set support", function () {
    it("should return values from Set", function () {
      const set = new Set([1, 2, 3]);
      const res = [...values(set)];
      expect(res).toEqual([1, 2, 3]);
    });

    it("should handle empty Set", function () {
      const set = new Set();
      const res = [...values(set)];
      expect(res).toEqual([]);
    });

    it("should preserve Set value types", function () {
      const set = new Set(["a", "b", "c"]);
      const res = [...values(set)];
      expect(res).toEqual(["a", "b", "c"]);
    });
  });
});
