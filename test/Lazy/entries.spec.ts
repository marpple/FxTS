import { entries } from "../../src";

describe("entries", function () {
  describe("Object support", function () {
    it("should return an iterator that iterates entries of the given object", function () {
      const obj = {
        a: 1,
        b: "2",
        c: true,
        d: null,
        e: undefined,
      };
      const iter = entries(obj);
      expect(iter.next().value).toEqual(["a", 1]);
      const res = [...iter];
      expect(res).toEqual([
        ["b", "2"],
        ["c", true],
        ["d", null],
        ["e", undefined],
      ]);
    });

    it("should only deal with enumerable properties", function () {
      const obj = { a: 1, b: 2, c: 3 };
      Object.defineProperty(obj, "a", {
        enumerable: false,
      });
      Object.defineProperty(obj, "c", {
        enumerable: false,
      });
      const res = [...entries(obj)];
      expect(res).toEqual([["b", 2]]);
    });

    it("should only deal with its own properties", function () {
      class Parent {
        a = 1;
      }
      class Child extends Parent {
        b = 2;
      }
      const instance = new Child();
      const proto = Object.getPrototypeOf(instance);
      proto.__proto__.c = 3;
      const res = [...entries(instance)];
      expect((instance as any).c).toEqual(3);
      expect(res).toEqual([
        ["a", 1],
        ["b", 2],
      ]);
    });
  });

  describe("Map support", function () {
    it("should return entries from Map", function () {
      const map = new Map([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);
      const res = [...entries(map)];
      expect(res).toEqual([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);
    });

    it("should handle empty Map", function () {
      const map = new Map();
      const res = [...entries(map)];
      expect(res).toEqual([]);
    });

    it("should preserve Map key types", function () {
      const map = new Map<number, string>([
        [1, "a"],
        [2, "b"],
      ]);
      const res = [...entries(map)];
      expect(res).toEqual([
        [1, "a"],
        [2, "b"],
      ]);
    });
  });

  describe("Set support", function () {
    it("should return entries from Set as [value, value] pairs", function () {
      const set = new Set([1, 2, 3]);
      const res = [...entries(set)];
      expect(res).toEqual([
        [1, 1],
        [2, 2],
        [3, 3],
      ]);
    });

    it("should handle empty Set", function () {
      const set = new Set();
      const res = [...entries(set)];
      expect(res).toEqual([]);
    });
  });
});
