import { add, pipe } from "../src";

describe("add", function () {
  describe("sync", function () {
    it.each([
      [1, 2, 3],
      ["a", "b", "ab"],
    ])("should add two values %s %s", function (a, b, result) {
      expect(add(a as any, b as any)).toEqual(result);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res1 = pipe(1, add(2));
      expect(res1).toEqual(3);
      const res2 = pipe("b", add("a"));
      expect(res2).toEqual("ab");
    });
  });

  describe("async", function () {
    it.each([
      [Promise.resolve(1), 2, 3],
      [1, Promise.resolve(2), 3],
      [Promise.resolve(1), Promise.resolve(2), 3],
      [Promise.resolve("a"), "b", "ab"],
      ["a", Promise.resolve("b"), "ab"],
      [Promise.resolve("a"), Promise.resolve("b"), "ab"],
    ])("should add two values %s %s", async function (a, b, result) {
      expect(await add(a as Promise<any>, b as Promise<any>)).toEqual(result);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res1 = await pipe(1, add(Promise.resolve(2)));
      expect(res1).toEqual(3);
      const res2 = await pipe("b", add(Promise.resolve("a")));
      expect(res2).toEqual("ab");
    });
  });
});
