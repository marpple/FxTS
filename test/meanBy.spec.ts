import { meanBy, pipe, toAsync } from "../src";
import { AsyncFunctionException } from "../src/_internal/error";

const given = [
  { name: "a", score: 80 },
  { name: "b", score: 100 },
  { name: "c", score: 90 },
];

describe("meanBy", function () {
  describe("sync", function () {
    it("should return the average of the values produced by f", function () {
      expect(meanBy((a) => a.score, given)).toBe(90);
    });

    it("should return NaN for an empty iterable", function () {
      expect(meanBy((a: { score: number }) => a.score, [])).toBeNaN();
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        given,
        meanBy((a) => a.score),
      );
      expect(res).toBe(90);
    });

    it("should throw an error when the callback is asynchronous", function () {
      expect(() =>
        meanBy((a) => Promise.resolve(a.score) as any, given),
      ).toThrow(new AsyncFunctionException());
    });
  });

  describe("async", function () {
    it("should work with AsyncIterable", async function () {
      expect(await meanBy((a) => a.score, toAsync(given))).toBe(90);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync(given),
        meanBy((a) => a.score),
      );
      expect(res).toBe(90);
    });
  });
});
