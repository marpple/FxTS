import { filter, map, pipe, some, toAsync } from "../src";
import { AsyncFunctionException } from "../src/_internal/error";

describe("some", function () {
  describe("sync", function () {
    it("should return 'false' if given iterable is an empty array", function () {
      expect(some((a) => a, [])).toEqual(false);
    });

    it.each([
      [(a: number) => a % 2 === 0, [2, 4, 6, 8, 10], true],
      [(a: number) => a % 2 === 0, [1, 4, 6, 8, 10], true],
      [(a: number) => a % 2 === 0, [2, 4, 7, 8, 10], true],
      [(a: number) => a % 2 === 0, [2, 4, 7, 8, 11], true],
      [(a: number) => a % 2 === 1, [2, 4, 6, 8, 10], false],
    ])(
      `should return result when passed arguments are synchronous function and 'Iterable'`,
      (f, iterable, result) => {
        expect(some(f, iterable)).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", function () {
      const res1 = pipe(
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        filter((a) => a % 2 === 0),
        some((a) => a % 2 === 0),
      );
      expect(res1).toEqual(true);

      const res2 = pipe(
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        map((a) => a + 10),
        some((a) => a > 10),
      );
      expect(res2).toEqual(true);

      const res3 = pipe(
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        map((a) => a + 10),
        some((a) => a < 10),
      );
      expect(res3).toEqual(false);

      const res4 = pipe(
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        map((a) => a + 10),
        some((a) => a < 15),
      );
      expect(res4).toEqual(true);
    });

    it("should throw an error when the callback is asynchronous", function () {
      expect(() =>
        pipe(
          [1, 2, 3, 4, 5, 6, 7, 8, 9],
          filter((a) => a % 2 === 0),
          some((a) => Promise.resolve(a % 2 === 0)),
        ),
      ).toThrowError(new AsyncFunctionException());
    });
  });

  describe("async", function () {
    it.each([
      [(a: number) => a % 2 === 0, toAsync([2, 4, 6, 8, 10]), true],
      [(a: number) => a % 2 === 0, toAsync([1, 4, 6, 8, 10]), true],
      [(a: number) => a % 2 === 0, toAsync([2, 4, 7, 8, 10]), true],
      [(a: number) => a % 2 === 0, toAsync([2, 4, 7, 8, 11]), true],
      [(a: number) => a % 2 === 1, toAsync([2, 4, 6, 8, 10]), false],
    ])(
      `should return result when passed arguments are synchronous function and 'AsyncIterable'`,
      async (f, iterable, result) => {
        expect(await some(f, iterable)).toEqual(result);
      },
    );
    it.each([
      [
        (a: number) => Promise.resolve(a % 2 === 0),
        toAsync([2, 4, 6, 8, 10]),
        true,
      ],
      [
        (a: number) => Promise.resolve(a % 2 === 0),
        toAsync([1, 4, 6, 8, 10]),
        true,
      ],
      [
        (a: number) => Promise.resolve(a % 2 === 0),
        toAsync([2, 4, 7, 8, 10]),
        true,
      ],
      [
        (a: number) => Promise.resolve(a % 2 === 0),
        toAsync([2, 4, 7, 8, 11]),
        true,
      ],
      [
        (a: number) => Promise.resolve(a % 2 === 1),
        toAsync([2, 4, 6, 8, 10]),
        false,
      ],
    ])(
      `should return result when passed arguments are asynchronous function and 'AsyncIterable'`,
      async (f, iterable, result) => {
        expect(await some(f, iterable)).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res1 = await pipe(
        toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        filter((a) => a % 2 === 0),
        some((a) => a % 2 === 0),
      );
      expect(res1).toEqual(true);

      const res2 = await pipe(
        toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        map((a) => a + 10),
        some((a) => a > 10),
      );
      expect(res2).toEqual(true);

      const res3 = await pipe(
        toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        map((a) => a + 10),
        some((a) => Promise.resolve(a < 10)),
      );
      expect(res3).toEqual(false);

      const res4 = await pipe(
        toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        map((a) => a + 10),
        some((a) => Promise.resolve(a < 15)),
      );
      expect(res4).toEqual(true);
    });
  });
});
