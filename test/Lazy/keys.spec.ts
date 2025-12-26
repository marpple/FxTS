import { keys } from "../../src";

describe("keys", function () {
  describe("Object support", function () {
    it("should return an iterator that iterates keys of the given object", function () {
      const obj = {
        a: 1,
        b: "2",
        c: true,
        d: Symbol("a"),
        e: function () {
          return null;
        },
        f: null,
        g: undefined,
      };
      const iter = keys(obj);
      expect(iter.next().value).toEqual("a");
      const res = [...iter];
      expect(res).toEqual(["b", "c", "d", "e", "f", "g"]);
    });
  });

  describe("Map support", function () {
    it("should return keys from Map", function () {
      const map = new Map([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);
      const res = [...keys(map)];
      expect(res).toEqual(["a", "b", "c"]);
    });

    it("should handle empty Map", function () {
      const map = new Map();
      const res = [...keys(map)];
      expect(res).toEqual([]);
    });

    it("should preserve Map key types", function () {
      const map = new Map<number, string>([
        [1, "a"],
        [2, "b"],
      ]);
      const res = [...keys(map)];
      expect(res).toEqual([1, 2]);
    });
  });

  describe("Set support", function () {
    it("should return values from Set as keys", function () {
      const set = new Set([1, 2, 3]);
      const res = [...keys(set)];
      expect(res).toEqual([1, 2, 3]);
    });

    it("should handle empty Set", function () {
      const set = new Set();
      const res = [...keys(set)];
      expect(res).toEqual([]);
    });

    it("should preserve Set value types", function () {
      const set = new Set(["a", "b", "c"]);
      const res = [...keys(set)];
      expect(res).toEqual(["a", "b", "c"]);
    });
  });
});
