import { pick, pipe, toAsync } from "../src";

describe("pick", function () {
  describe("sync", function () {
    it("should be picked properties as given keys", function () {
      const obj = { a: 1, b: 2, c: "3" };
      expect(pick(["a", "c"], obj)).toEqual({ a: 1, c: "3" });
    });
    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        { a: 1, b: "2", c: true },
        pick(["a", "b"]),
        Object.entries,
      );
      expect(res).toEqual([
        ["a", 1],
        ["b", "2"],
      ]);
    });
  });

  describe("async", function () {
    it("should be picked properties as given keys", async function () {
      const obj = { a: 1, b: 2, c: "3" };
      const iter = toAsync(["a", "c"] as const);
      const res = await pick(iter, obj);
      expect(res).toEqual({ a: 1, c: "3" });
    });
    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        { a: 1, b: "2", c: true },
        pick(toAsync(["a", "b"] as const)),
        Object.entries,
      );
      expect(res).toEqual([
        ["a", 1],
        ["b", "2"],
      ]);
    });
  });
});
