import { isMatch } from "../src";

describe("isMatch", function () {
  describe("primitives", function () {
    it("should return true for equal primitives", function () {
      expect(isMatch(1, 1)).toBe(true);
      expect(isMatch("hello", "hello")).toBe(true);
      expect(isMatch(true, true)).toBe(true);
    });

    it("should return false for different primitives", function () {
      expect(isMatch(1, 2)).toBe(false);
      expect(isMatch("hello", "world")).toBe(false);
    });

    it("should treat NaN as equal to NaN", function () {
      expect(isMatch(NaN, NaN)).toBe(true);
    });
  });

  describe("partial object matching", function () {
    it("should return true when object contains all source properties", function () {
      expect(isMatch({ a: 1, b: 2 }, { a: 1 })).toBe(true);
      expect(isMatch({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 })).toBe(true);
    });

    it("should return false when object is missing source properties", function () {
      expect(isMatch({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it("should return false when property values differ", function () {
      expect(isMatch({ a: 1 }, { a: 2 })).toBe(false);
    });

    it("should treat NaN values in properties as equal", function () {
      expect(isMatch({ a: NaN }, { a: NaN })).toBe(true);
      expect(isMatch({ a: NaN, b: 1 }, { a: NaN })).toBe(true);
    });

    it("should match nested objects partially", function () {
      const object = { user: { name: "John", age: 30 } };
      expect(isMatch(object, { user: { name: "John" } })).toBe(true);
    });

    it("should match deeply nested objects", function () {
      const object = { a: { b: { c: true } } };
      expect(isMatch(object, { a: { b: { c: true } } })).toBe(true);
      expect(isMatch(object, { a: { b: { c: false } } })).toBe(false);
    });
  });

  describe("array matching", function () {
    it("should return true for equal arrays", function () {
      expect(isMatch([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isMatch([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    it("should partially match when source is a prefix of object", function () {
      expect(isMatch([1, 2, 3], [1, 2])).toBe(true);
      expect(isMatch([1, 2, 3], [1])).toBe(true);
      expect(isMatch([1, 2, 3], [])).toBe(true);
    });

    it("should return false when source is longer than object", function () {
      expect(isMatch([1, 2], [1, 2, 3])).toBe(false);
    });

    it("should return false when prefix values differ", function () {
      expect(isMatch([1, 2, 3], [2, 3])).toBe(false);
    });

    it("should match arrays with objects partially", function () {
      expect(isMatch([{ a: 1 }], [{ a: 1 }])).toBe(true);
      expect(isMatch([{ a: 1, b: 2 }, { c: 3 }], [{ a: 1 }])).toBe(true);
    });
  });

  describe("Date matching", function () {
    it("should match equal Date objects", function () {
      expect(isMatch(new Date("2024-01-01"), new Date("2024-01-01"))).toBe(
        true,
      );
    });

    it("should return false for different Date objects", function () {
      expect(isMatch(new Date("2024-01-01"), new Date("2024-02-01"))).toBe(
        false,
      );
    });

    it("should return false when comparing Date with non-Date", function () {
      expect(isMatch(new Date("2024-01-01"), {})).toBe(false);
      expect(isMatch({}, new Date("2024-01-01"))).toBe(false);
    });
  });

  describe("RegExp matching", function () {
    it("should match equal RegExp objects", function () {
      expect(isMatch(/abc/gi, /abc/gi)).toBe(true);
    });

    it("should return false for different RegExp objects", function () {
      expect(isMatch(/abc/gi, /abc/g)).toBe(false);
    });

    it("should return false when comparing RegExp with non-RegExp", function () {
      expect(isMatch(/abc/, {})).toBe(false);
      expect(isMatch({}, /abc/)).toBe(false);
    });
  });

  describe("Map matching", function () {
    it("should match equal Map objects", function () {
      const object = new Map([["a", 1]]);
      const source = new Map([["a", 1]]);
      expect(isMatch(object, source)).toBe(true);
    });

    it("should partially match Map objects", function () {
      const object = new Map([
        ["a", 1],
        ["b", 2],
      ]);
      const source = new Map([["a", 1]]);
      expect(isMatch(object, source)).toBe(true);
    });

    it("should return false for non-matching Map values", function () {
      const object = new Map([
        ["a", 1],
        ["b", 2],
      ]);
      const source = new Map([
        ["a", 1],
        ["b", 3],
      ]);
      expect(isMatch(object, source)).toBe(false);
    });

    it("should return false when source Map has keys not in object", function () {
      const object = new Map([["a", 1]]);
      const source = new Map([
        ["a", 1],
        ["b", 2],
      ]);
      expect(isMatch(object, source)).toBe(false);
    });

    it("should return false when comparing Map with non-Map", function () {
      expect(isMatch(new Map(), {})).toBe(false);
      expect(isMatch({}, new Map())).toBe(false);
    });

    it("should handle NaN in Map values", function () {
      const object = new Map<string, unknown>([["a", NaN]]);
      const source = new Map<string, unknown>([["a", NaN]]);
      expect(isMatch(object, source)).toBe(true);
    });
  });

  describe("Set matching", function () {
    it("should partially match Set objects", function () {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([1, 2, 3]);
      expect(isMatch(set1, set2)).toBe(true);
    });

    it("should return false for non-matching Set objects", function () {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([1, 4]);
      expect(isMatch(set1, set2)).toBe(false);
    });

    it("should return false when source Set is larger than object", function () {
      const object = new Set([1, 2]);
      const source = new Set([1, 2, 3]);
      expect(isMatch(object, source)).toBe(false);
    });

    it("should not allow the same object value to match multiple source values", function () {
      const object = new Set([{ a: 1 }, { b: 2 }]);
      const source = new Set([{ a: 1 }, { a: 1 }]);
      expect(isMatch(object, source)).toBe(false);
    });

    it("should correctly match Sets with structurally identical but distinct values", function () {
      const object = new Set([{ a: 1 }, { a: 1 }]);
      const source = new Set([{ a: 1 }]);
      expect(isMatch(object, source)).toBe(true);
    });

    it("should match Set values regardless of iteration order", function () {
      const object = new Set([{ a: 1, b: 1 }, { a: 1 }]);
      const source = new Set([{ a: 1 }, { a: 1, b: 1 }]);
      expect(isMatch(object, source)).toBe(true);
    });

    it("should match Set with complex order-dependent scenarios", function () {
      const object = new Set([{ x: 1, y: 2 }, { x: 1 }, { z: 3 }]);
      const source = new Set([{ x: 1 }, { x: 1, y: 2 }]);
      expect(isMatch(object, source)).toBe(true);
    });

    it("should return false when comparing Set with non-Set", function () {
      expect(isMatch(new Set(), {})).toBe(false);
      expect(isMatch({}, new Set())).toBe(false);
    });

    it("should handle NaN in Sets", function () {
      expect(isMatch(new Set([NaN, 1]), new Set([NaN]))).toBe(true);
    });
  });

  describe("cross-type matching", function () {
    it("should return false when comparing incompatible special types", function () {
      expect(isMatch(new Date("2024-01-01"), new Map())).toBe(false);
      expect(isMatch(new Map(), new Set())).toBe(false);
      expect(isMatch(new Set([1]), /abc/)).toBe(false);
    });
  });

  describe("null and undefined", function () {
    it("should return false when object is null or undefined", function () {
      expect(isMatch(null, { a: 1 })).toBe(false);
      expect(isMatch(undefined, { a: 1 })).toBe(false);
    });

    it("should return false when source is null or undefined", function () {
      expect(isMatch({ a: 1 }, null)).toBe(false);
      expect(isMatch({ a: 1 }, undefined)).toBe(false);
    });
  });

  describe("empty pattern", function () {
    it("should return true for empty source object", function () {
      expect(isMatch({ a: 1 }, {})).toBe(true);
    });
  });
});
