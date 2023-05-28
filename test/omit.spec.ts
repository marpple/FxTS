import { omit, pipe, toAsync } from "../src";

describe("omit", function () {
  describe("sync", function () {
    it("should be omitted properties as given keys", function () {
      const obj = { a: 1, b: 2, c: "3" };
      expect(omit(["a", "c"], obj)).toEqual({ b: 2 });
    });
    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        { a: 1, b: "2", c: true },
        omit(["a", "b"]),
        Object.entries,
      );
      expect(res).toEqual([["c", true]]);
    });
  });

  describe("async", function () {
    it("should be omitted properties as given keys", async function () {
      const obj = { a: 1, b: 2, c: "3" };
      const iter = toAsync(["a", "c"] as const);
      const res = await omit(iter, obj);
      expect(res).toEqual({ b: 2 });
    });
    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        { a: 1, b: "2", c: true },
        omit(toAsync(["a", "b"] as const)),
        Object.entries,
      );
      expect(res).toEqual([["c", true]]);
    });
  });
});
