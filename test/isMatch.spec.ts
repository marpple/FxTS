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

    it("should match nested objects partially", function () {
      const object = { user: { name: "John", age: 30 } };
      expect(isMatch(object, { user: { name: "John" } })).toBe(true);
    });

    it("should return false for non-matching nested objects", function () {
      const object = { user: { name: "John", age: 30 } };
      expect(isMatch(object, { user: { name: "Jane" } })).toBe(false);
    });

    it("should match deeply nested objects", function () {
      const object = {
        level1: {
          level2: {
            level3: { value: "deep" },
          },
        },
      };
      expect(
        isMatch(object, { level1: { level2: { level3: { value: "deep" } } } }),
      ).toBe(true);
    });
  });

  describe("array matching", function () {
    it("should return true for equal arrays", function () {
      expect(isMatch([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it("should return false for different arrays", function () {
      expect(isMatch([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isMatch([1, 2], [1, 2, 3])).toBe(false);
      expect(isMatch([1, 2, 3], [1, 2])).toBe(false);
    });

    it("should match arrays with objects", function () {
      expect(isMatch([{ a: 1 }], [{ a: 1 }])).toBe(true);
    });
  });

  describe("special types", function () {
    it("should match Date objects", function () {
      expect(isMatch(new Date("2024-01-01"), new Date("2024-01-01"))).toBe(
        true,
      );
      expect(isMatch(new Date("2024-01-01"), new Date("2024-02-01"))).toBe(
        false,
      );
    });

    it("should match RegExp objects", function () {
      expect(isMatch(/abc/gi, /abc/gi)).toBe(true);
      expect(isMatch(/abc/gi, /abc/g)).toBe(false);
    });

    it("should match Map objects", function () {
      const map1 = new Map([["a", 1]]);
      const map2 = new Map([["a", 1]]);
      expect(isMatch(map1, map2)).toBe(true);
    });

    it("should match Set objects", function () {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([1, 2, 3]);
      expect(isMatch(set1, set2)).toBe(true);
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
