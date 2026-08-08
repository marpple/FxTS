import { isEqual } from "../src";

describe("isEqual", function () {
  describe("primitives", function () {
    it("should return true for equal primitives", function () {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual("hello", "hello")).toBe(true);
      expect(isEqual(true, true)).toBe(true);
    });

    it("should return false for different primitives", function () {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual("hello", "world")).toBe(false);
      expect(isEqual(true, false)).toBe(false);
    });

    it("should return false for different types", function () {
      expect(isEqual(1, "1")).toBe(false);
      expect(isEqual(0, false)).toBe(false);
    });

    it("should treat NaN as equal to NaN", function () {
      expect(isEqual(NaN, NaN)).toBe(true);
      expect(isEqual({ a: NaN }, { a: NaN })).toBe(true);
    });
  });

  describe("objects", function () {
    it("should return true for deeply equal objects regardless of key order", function () {
      expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
      expect(
        isEqual({ a: 1, b: { c: 2, d: 3 } }, { b: { d: 3, c: 2 }, a: 1 }),
      ).toBe(true);
    });

    it("should return false when key counts differ", function () {
      expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
      expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it("should return false for an extra key with undefined value", function () {
      expect(isEqual({ a: 1 }, { a: 1, b: undefined })).toBe(false);
    });

    it("should return false when property values differ", function () {
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(isEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    });
  });

  describe("arrays", function () {
    it("should return true for equal arrays", function () {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true);
    });

    it("should return false when order differs", function () {
      expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    });

    it("should return false when lengths differ", function () {
      expect(isEqual([1, 2, 3], [1, 2])).toBe(false);
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it("should return false when comparing array with plain object", function () {
      expect(isEqual([], {})).toBe(false);
      expect(isEqual({}, [])).toBe(false);
    });
  });

  describe("Date", function () {
    it("should return true for Dates with the same time", function () {
      expect(isEqual(new Date("2024-01-01"), new Date("2024-01-01"))).toBe(
        true,
      );
    });

    it("should return false for Dates with different times", function () {
      expect(isEqual(new Date("2024-01-01"), new Date("2024-02-01"))).toBe(
        false,
      );
    });

    it("should return false when comparing Date with non-Date", function () {
      expect(isEqual(new Date("2024-01-01"), {})).toBe(false);
      expect(isEqual({}, new Date("2024-01-01"))).toBe(false);
    });
  });

  describe("RegExp", function () {
    it("should return true for RegExps with the same source and flags", function () {
      expect(isEqual(/abc/gi, /abc/gi)).toBe(true);
    });

    it("should return false for RegExps with different source or flags", function () {
      expect(isEqual(/abc/gi, /abc/g)).toBe(false);
      expect(isEqual(/abc/, /abd/)).toBe(false);
    });
  });

  describe("Map", function () {
    it("should return true for equal Maps regardless of insertion order", function () {
      const a = new Map([
        ["a", 1],
        ["b", 2],
      ]);
      const b = new Map([
        ["b", 2],
        ["a", 1],
      ]);
      expect(isEqual(a, b)).toBe(true);
    });

    it("should return false when sizes differ", function () {
      const a = new Map([
        ["a", 1],
        ["b", 2],
      ]);
      const b = new Map([["a", 1]]);
      expect(isEqual(a, b)).toBe(false);
      expect(isEqual(b, a)).toBe(false);
    });

    it("should return false when values differ", function () {
      expect(isEqual(new Map([["a", 1]]), new Map([["a", 2]]))).toBe(false);
    });

    it("should deeply compare values", function () {
      const a = new Map([["a", { b: [1, 2] }]]);
      const b = new Map([["a", { b: [1, 2] }]]);
      expect(isEqual(a, b)).toBe(true);
    });

    it("should deeply compare object keys", function () {
      expect(isEqual(new Map([[{ a: 1 }, 1]]), new Map([[{ a: 1 }, 1]]))).toBe(
        true,
      );
      expect(isEqual(new Map([[{ a: 1 }, 1]]), new Map([[{ a: 2 }, 1]]))).toBe(
        false,
      );
      expect(isEqual(new Map([[{ a: 1 }, 1]]), new Map([[{ a: 1 }, 2]]))).toBe(
        false,
      );
    });

    it("should match entries with deeply equal keys regardless of order", function () {
      const a = new Map([
        [{ x: 1 }, 1],
        [{ x: 2 }, 2],
      ]);
      const b = new Map([
        [{ x: 2 }, 2],
        [{ x: 1 }, 1],
      ]);
      expect(isEqual(a, b)).toBe(true);
    });

    it("should return false when comparing Map with non-Map", function () {
      expect(isEqual(new Map(), {})).toBe(false);
      expect(isEqual({}, new Map())).toBe(false);
    });
  });

  describe("Set", function () {
    it("should return true for equal Sets regardless of order", function () {
      expect(isEqual(new Set([1, 2, 3]), new Set([3, 1, 2]))).toBe(true);
      expect(
        isEqual(new Set([{ a: 1 }, { b: 2 }]), new Set([{ b: 2 }, { a: 1 }])),
      ).toBe(true);
    });

    it("should return false when sizes differ", function () {
      expect(isEqual(new Set([1, 2, 3]), new Set([1, 2]))).toBe(false);
      expect(isEqual(new Set([1, 2]), new Set([1, 2, 3]))).toBe(false);
    });

    it("should return false when values differ", function () {
      expect(isEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false);
      expect(isEqual(new Set([{ a: 1 }]), new Set([{ a: 2 }]))).toBe(false);
    });

    it("should handle structurally equal duplicate objects", function () {
      const a = new Set([{ a: 1 }, { a: 1 }]);
      const b = new Set([{ a: 1 }, { a: 1 }]);
      expect(isEqual(a, b)).toBe(true);
    });

    it("should handle NaN in Sets", function () {
      expect(isEqual(new Set([NaN, 1]), new Set([1, NaN]))).toBe(true);
    });

    it("should return false when comparing Set with non-Set", function () {
      expect(isEqual(new Set(), {})).toBe(false);
      expect(isEqual(new Map(), new Set())).toBe(false);
    });
  });

  describe("functions", function () {
    it("should compare functions by reference only", function () {
      const fn = () => 1;
      expect(isEqual(fn, fn)).toBe(true);
      expect(
        isEqual(
          () => 1,
          () => 1,
        ),
      ).toBe(false);
    });
  });

  describe("null and undefined", function () {
    it("should return true for same nil values", function () {
      expect(isEqual(null, null)).toBe(true);
      expect(isEqual(undefined, undefined)).toBe(true);
    });

    it("should return false for null vs undefined", function () {
      expect(isEqual(null, undefined)).toBe(false);
    });

    it("should return false for null vs object", function () {
      expect(isEqual(null, {})).toBe(false);
      expect(isEqual({}, null)).toBe(false);
    });
  });
});
