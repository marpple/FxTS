import {
  every,
  filter,
  find,
  fx,
  isMatch,
  map,
  matches,
  pipe,
  some,
} from "../src";

describe("matches", function () {
  describe("basic matching", function () {
    it("should return true when all properties match", function () {
      const matcher = matches({ a: 1, b: "2", c: true });
      const input = { a: 1, b: "2", c: true, d: {} };
      expect(matcher(input)).toBe(true);
    });

    it("should return false when any property does not match", function () {
      const matcher = matches({ a: 1, b: "2", c: true });
      const input = { a: 1, b: "2", c: false };
      expect(matcher(input)).toBe(false);
    });

    it("should return true for empty pattern", function () {
      const matcher = matches({});
      expect(matcher({ a: 1 })).toBe(true);
    });

    it("should return false for nil input", function () {
      const matcher = matches({});
      expect(matcher(null as any)).toBe(false);
      expect(matcher(undefined as any)).toBe(false);
    });

    it("should be able to used as a curried function in the pipeline", function () {
      const result = pipe(
        { a: 1, b: "2", c: true, d: null },
        matches({ a: 1, b: "2" }),
      );
      expect(result).toBe(true);
    });
  });

  describe("find", function () {
    const users = [
      { id: 1, name: "John", age: 30 },
      { id: 2, name: "Jane", age: 25 },
      { id: 3, name: "Bob", age: 30 },
    ];

    it("should work with find", function () {
      const result = find(matches({ age: 30 }), users);

      expect(result).toEqual({ id: 1, name: "John", age: 30 });
    });

    it("should return undefined when not found", function () {
      const result = find(matches({ age: 40 }), users);

      expect(result).toBeUndefined();
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const result = pipe(users, find(matches({ name: "Jane" })));

      expect(result).toEqual({ id: 2, name: "Jane", age: 25 });
    });

    it("should be able to be used as a chaining method in the `fx`", function () {
      const result = fx(users).find(matches({ id: 3 }));

      expect(result).toEqual({ id: 3, name: "Bob", age: 30 });
    });
  });

  describe("filter", function () {
    const users = [
      { id: 1, name: "John", age: 30, active: true },
      { id: 2, name: "Jane", age: 25, active: false },
      { id: 3, name: "Bob", age: 30, active: true },
    ];

    it("should work with filter in pipeline", function () {
      const result = pipe(
        users,
        filter(matches({ age: 30 })),
        map((u) => u.name),
      );

      expect([...result]).toEqual(["John", "Bob"]);
    });

    it("should work with filter in fx chain", function () {
      const result = fx(users)
        .filter(matches({ active: true }))
        .map((u) => u.id);

      expect([...result]).toEqual([1, 3]);
    });
  });

  describe("some", function () {
    const users = [
      { name: "John", age: 30, active: true },
      { name: "Jane", age: 25, active: false },
      { name: "Bob", age: 30, active: true },
    ];

    it("should return true when at least one matches", function () {
      const result = some(matches({ age: 25 }), users);

      expect(result).toBe(true);
    });

    it("should return false when none match", function () {
      const result = some(matches({ age: 40 }), users);

      expect(result).toBe(false);
    });

    it("should work in pipeline", function () {
      const result = pipe(users, some(matches({ name: "Bob", active: true })));

      expect(result).toBe(true);
    });
  });

  describe("every", function () {
    const users = [
      { name: "John", age: 30, active: true },
      { name: "Jane", age: 25, active: true },
      { name: "Bob", age: 30, active: true },
    ];

    it("should return true when all match", function () {
      const result = every(matches({ active: true }), users);

      expect(result).toBe(true);
    });

    it("should return false when not all match", function () {
      const result = every(matches({ age: 30 }), users);

      expect(result).toBe(false);
    });

    it("should work in pipeline", function () {
      const result = pipe(users, every(matches({ active: true })));

      expect(result).toBe(true);
    });
  });

  describe("deep matching", function () {
    it("should match nested objects", function () {
      const data = [
        { id: 1, user: { name: "John", profile: { age: 30 } } },
        { id: 2, user: { name: "Jane", profile: { age: 25 } } },
        { id: 3, user: { name: "Bob", profile: { age: 30 } } },
      ];

      const result = filter(matches({ user: { profile: { age: 30 } } }), data);

      expect([...result]).toEqual([
        { id: 1, user: { name: "John", profile: { age: 30 } } },
        { id: 3, user: { name: "Bob", profile: { age: 30 } } },
      ]);
    });

    it("should match arrays", function () {
      const data = [
        { id: 1, tags: ["a", "b"] },
        { id: 2, tags: ["c", "d"] },
        { id: 3, tags: ["a", "b"] },
      ];

      const result = filter(matches({ tags: ["a", "b"] }), data);

      expect([...result]).toEqual([
        { id: 1, tags: ["a", "b"] },
        { id: 3, tags: ["a", "b"] },
      ]);
    });

    it("should match nested arrays with objects", function () {
      const data = [
        { id: 1, items: [{ x: 1 }, { x: 2 }] },
        { id: 2, items: [{ x: 3 }, { x: 4 }] },
        { id: 3, items: [{ x: 1 }, { x: 2 }] },
      ];

      const result = filter(matches({ items: [{ x: 1 }, { x: 2 }] }), data);

      expect([...result]).toEqual([
        { id: 1, items: [{ x: 1 }, { x: 2 }] },
        { id: 3, items: [{ x: 1 }, { x: 2 }] },
      ]);
    });

    it("should return false for non-matching nested objects", function () {
      const matcher = matches({ user: { name: "John" } });

      expect(matcher({ user: { name: "Jane" } })).toBe(false);
    });

    it("should return false for non-matching arrays", function () {
      const matcher = matches({ tags: ["a", "b"] });

      expect(matcher({ tags: ["a", "c"] })).toBe(false);
      expect(matcher({ tags: ["a"] })).toBe(false);
    });

    it("should match Date objects", function () {
      const date = new Date("2024-01-01");
      const data = [
        { id: 1, created: new Date("2024-01-01") },
        { id: 2, created: new Date("2024-02-01") },
      ];

      const result = find(matches({ created: date }), data);

      expect(result).toEqual({ id: 1, created: new Date("2024-01-01") });
    });
  });

  describe("top-level non-object patterns", function () {
    it("should compare top-level Date patterns by value, not ignore them", function () {
      const matcher = matches(new Date("2024-01-01"));

      expect(matcher(new Date("2024-01-01"))).toBe(true);
      expect(matcher(new Date("2025-01-01"))).toBe(false);
    });

    it("should compare top-level RegExp patterns by value", function () {
      const matcher = matches(/abc/gi);

      expect(matcher(/abc/gi)).toBe(true);
      expect(matcher(/abc/g)).toBe(false);
    });

    it("should compare top-level primitive patterns by value", function () {
      expect(matches(1)(1)).toBe(true);
      expect(matches(1)(2)).toBe(false);
      expect(matches("a")("a")).toBe(true);
      expect(matches("a")("b")).toBe(false);
    });

    it("should compare top-level array patterns by prefix", function () {
      const matcher = matches([1, 2]);

      expect(matcher([1, 2, 3])).toBe(true);
      expect(matcher([1, 3])).toBe(false);
    });

    it("should compare top-level Map patterns by value", function () {
      const matcher = matches(new Map([["a", 1]]));

      expect(
        matcher(
          new Map([
            ["a", 1],
            ["b", 2],
          ]),
        ),
      ).toBe(true);
      expect(matcher(new Map([["a", 2]]))).toBe(false);
    });

    it("should compare top-level Set patterns by value", function () {
      const matcher = matches(new Set([1, 2]));

      expect(matcher(new Set([1, 2, 3]))).toBe(true);
      expect(matcher(new Set([1, 3]))).toBe(false);
    });

    it("should return false when nil pattern is matched against a non-nil input", function () {
      expect(matches(null as any)({ a: 1 })).toBe(false);
      expect(matches(undefined as any)({ a: 1 })).toBe(false);
    });
  });

  describe("consistency with isMatch", function () {
    it("should produce the same result as isMatch(input, pattern)", function () {
      const superset = { a: 1, b: 2 };
      expect(matches({ a: 1 })(superset)).toBe(isMatch(superset, { a: 1 }));
      expect(matches({ a: 1 })({ a: 2 })).toBe(isMatch({ a: 2 }, { a: 1 }));
      expect(matches(new Date("2024-01-01"))(new Date("2025-01-01"))).toBe(
        isMatch(new Date("2025-01-01"), new Date("2024-01-01")),
      );
    });
  });
});
