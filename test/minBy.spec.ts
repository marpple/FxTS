import { minBy, pipe, toAsync } from "../src";
import { AsyncFunctionException } from "../src/_internal/error";

const given = [
  { name: "a", age: 21 },
  { name: "b", age: 41 },
  { name: "c", age: 31 },
];

describe("minBy", function () {
  describe("sync", function () {
    it("should return the element with the smallest value of f", function () {
      expect(minBy((a) => a.age, given)).toEqual({ name: "a", age: 21 });
    });

    it("should return undefined for an empty iterable", function () {
      expect(minBy((a: { age: number }) => a.age, [])).toBe(undefined);
    });

    it("should return the first element among ties", function () {
      const res = minBy(
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
        minBy((a) => a.age),
      );
      expect(res).toEqual({ name: "a", age: 21 });
    });

    it("should throw an error when the callback is asynchronous", function () {
      expect(() => minBy((a) => Promise.resolve(a.age) as any, given)).toThrow(
        new AsyncFunctionException(),
      );
    });
  });

  describe("async", function () {
    it("should work with AsyncIterable", async function () {
      const res = await minBy((a) => a.age, toAsync(given));
      expect(res).toEqual({ name: "a", age: 21 });
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync(given),
        minBy((a) => a.age),
      );
      expect(res).toEqual({ name: "a", age: 21 });
    });
  });
});
