import { fromEntries, toAsync } from "../src";

//an object from string keyed-value pairs.
describe("fromEntries", function () {
  describe("sync", function () {
    it("should return proper object when iterable string keyed-value pairs is given as an argument", function () {
      const arr = [
        ["a", 1],
        ["b", true],
        ["c", "hello"],
        ["d", { d1: 1, d2: 3 }],
      ] as (
        | ["a", number]
        | ["b", true]
        | ["c", string]
        | ["d", { d1: number; d2: number }]
      )[];
      const res = fromEntries(arr);
      expect(res).toEqual({ a: 1, b: true, c: "hello", d: { d1: 1, d2: 3 } });
    });
    it("should return proper object when ES6 Map is given as an argument", function () {
      const sym = Symbol();
      const sym2 = Symbol();
      const arr: [
        string | number | symbol,
        number | string | { a1: number; b1: string },
      ][] = [
        ["a", 1],
        ["b", "hello"],
        [10, 1000],
        [20, 2000],
        [sym, "symbol"],
        [sym2, { a1: 100, b1: "hello symbol" }],
        ["obj", { a1: 10, b1: "hello object" }],
      ];
      const map = new Map(arr);
      const res = fromEntries(map);
      expect(res).toEqual({
        10: 1000,
        20: 2000,
        a: 1,
        b: "hello",
        obj: { a1: 10, b1: "hello object" },
        [sym]: "symbol",
        [sym2]: { a1: 100, b1: "hello symbol" },
      });
    });
  });

  describe("async", function () {
    it("should return proper object when asyncIterable string keyed-value pairs is given as an argument", async function () {
      const arr = [
        ["a", 1],
        ["b", true],
        ["c", "hello"],
        ["d", { d1: 1, d2: 3 }],
      ] as (
        | ["a", number]
        | ["b", true]
        | ["c", string]
        | ["d", { d1: number; d2: number }]
      )[];
      const res = await fromEntries(toAsync(arr));
      expect(res).toEqual({ a: 1, b: true, c: "hello", d: { d1: 1, d2: 3 } });
    });
  });
});
