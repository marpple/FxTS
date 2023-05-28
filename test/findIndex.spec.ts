import { filter, findIndex, map, pipe, toAsync } from "../src";
import { AsyncFunctionException } from "../src/_internal/error";
import type Arrow from "../src/types/Arrow";

describe("findIndex", function () {
  describe("sync", function () {
    it.each([
      [(a: string) => a === "r", "marpple", 2],
      [(a: number) => a === 2, [1, 2, 3, 4], 1],
      [(a: number) => a === 5, [1, 2, 3, 4], -1],
    ])(
      `should return result when passed arguments are synchronous function and 'Iterable'`,
      (f, iterable, result) => {
        expect(findIndex(f as Arrow, iterable)).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", function () {
      const res1 = pipe(
        [1, 2, 3, 4],
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        findIndex((a) => a === 14),
      );
      expect(res1).toEqual(1);
    });

    it("should throw an error when the callback is asynchronous", function () {
      const res = () =>
        pipe(
          [1, 2, 3, 4],
          map((a) => a + 10),
          filter((a) => a % 2 === 0),
          findIndex((a) => Promise.resolve(a === 14)),
        );
      expect(res).toThrowError(new AsyncFunctionException());
    });
  });

  describe("async", function () {
    it("should findIndex out the result by the callback to given 'AsyncIterable'", async function () {
      const res1 = await findIndex((a) => a === 5, toAsync([1, 2, 3, 4, 5, 6]));
      expect(res1).toEqual(4);

      const res2 = await findIndex((a) => a === 7, toAsync([1, 2, 3, 4, 5, 6]));
      expect(res2).toEqual(-1);
    });
  });

  it("should be able to be used as a curried function in the pipeline", async function () {
    const res1 = await pipe(
      toAsync([1, 2, 3, 4]),
      map((a) => a + 10),
      filter((a) => a % 2 === 0),
      findIndex((a) => a === 14),
    );
    expect(res1).toEqual(1);
  });
});
