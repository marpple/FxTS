import { fromEntries } from "../src/index";

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
  });
});
