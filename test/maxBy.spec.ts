import { maxBy, pipe, toAsync } from "../src";
import { AsyncFunctionException } from "../src/_internal/error";

const given = [
  { name: "a", age: 21 },
  { name: "b", age: 41 },
  { name: "c", age: 31 },
];

describe("maxBy", function () {
  describe("sync", function () {
    it("should return the element with the largest value of f", function () {
      expect(maxBy((a) => a.age, given)).toEqual({ name: "b", age: 41 });
    });

    it("should return undefined for an empty iterable", function () {
      expect(maxBy((a: { age: number }) => a.age, [])).toBe(undefined);
    });

    it("should return the first element among ties", function () {
      const res = maxBy(
        (a) => a.age,
        [
          { id: 1, age: 3 },
          { id: 2, age: 3 },
        ],
      );
      expect(res).toEqual({ id: 1, age: 3 });
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        given,
        maxBy((a) => a.age),
      );
      expect(res).toEqual({ name: "b", age: 41 });
    });

    it("should throw an error when the callback is asynchronous", function () {
      expect(() => maxBy((a) => Promise.resolve(a.age) as any, given)).toThrow(
        new AsyncFunctionException(),
      );
    });
  });

  describe("async", function () {
    it("should work with AsyncIterable", async function () {
      const res = await maxBy((a) => a.age, toAsync(given));
      expect(res).toEqual({ name: "b", age: 41 });
    });

    it("should return undefined for an empty AsyncIterable", async function () {
      const res = await maxBy(
        (a: { age: number }) => a.age,
        toAsync([] as { age: number }[]),
      );
      expect(res).toBe(undefined);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync(given),
        maxBy((a) => a.age),
      );
      expect(res).toEqual({ name: "b", age: 41 });
    });
  });
});
