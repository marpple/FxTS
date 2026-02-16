import { every, filter, find, fx, map, matches, pipe, some } from "../src";

describe("matches", function () {
  describe("basic matching", function () {
    it("should return true when all properties match", function () {
      const matcher = matches({ a: 1, b: "2", c: true });

      expect(matcher({ a: 1, b: "2", c: true, d: null })).toBe(true);
    });

    it("should return false when any property does not match", function () {
      const matcher = matches({ a: 1, b: "2", c: true });

      expect(matcher({ a: 1, b: "2", c: false })).toBe(false);
    });

    it("should return false when property is missing", function () {
      const matcher = matches({ a: 1, b: "2" });

      expect(matcher({ a: 1 })).toBe(false);
    });

    it("should return true for empty pattern", function () {
      const matcher = matches({});

      expect(matcher({ a: 1 })).toBe(true);
    });

    it("should return false for null input", function () {
      const matcher = matches({ a: 1 });

      expect(matcher(null)).toBe(false);
    });

    it("should return false for undefined input", function () {
      const matcher = matches({ a: 1 });

      expect(matcher(undefined)).toBe(false);
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
      expect(matcher({ tags: ["a", "b", "c"] })).toBe(false);
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
});
