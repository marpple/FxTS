import { pipe, sumBy, toAsync } from "../src";
import { AsyncFunctionException } from "../src/_internal/error";

const given = [
  { name: "apple", price: 100 },
  { name: "banana", price: 200 },
  { name: "orange", price: 300 },
];

describe("sumBy", function () {
  describe("sync", function () {
    it("should return the sum of the values produced by f", function () {
      expect(sumBy((a) => a.price, given)).toBe(600);
    });

    it("should return 0 for an empty iterable", function () {
      expect(sumBy((a: { price: number }) => a.price, [])).toBe(0);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        given,
        sumBy((a) => a.price),
      );
      expect(res).toBe(600);
    });

    it("should throw an error when the callback is asynchronous", function () {
      expect(() =>
        sumBy((a) => Promise.resolve(a.price) as any, given),
      ).toThrow(new AsyncFunctionException());
    });
  });

  describe("async", function () {
    it("should work with AsyncIterable", async function () {
      expect(await sumBy((a) => a.price, toAsync(given))).toBe(600);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync(given),
        sumBy((a) => a.price),
      );
      expect(res).toBe(600);
    });
  });
});
