import { delay, map, pipe, range, toArray, toAsync } from "../../src";
import concurrent, { Concurrent } from "../../src/Lazy/concurrent";
import scan from "../../src/Lazy/scan";
import { generatorMock } from "../utils";

describe("scan", function () {
  describe("sync", function () {
    it.each([
      [(a: number, b: number) => a * b, 1, [1, 2, 3, 4], [1, 1, 2, 6, 24]],
      [(a: string, b: string) => a + b, "a", ["b", "c"], ["a", "ab", "abc"]],
    ])(
      "should return value that is reduced given elements successively %s %s %s",
      function (f, seed, iterable, result) {
        expect(toArray(scan(f, seed, iterable as any))).toEqual(result);
      },
    );

    it.each([
      [(a: number, b: number) => a * b, [1, 2, 3, 4], [1, 2, 6, 24]],
      [(a: string, b: string) => a + b, ["a", "b", "c"], ["a", "ab", "abc"]],
    ])(
      "should reduce given elements successively without seed %s %s %s",
      function (f, iterable, result) {
        expect(toArray(scan(f, iterable as any))).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, 4],
        scan((a, b) => a * b),
        toArray,
      );

      expect(res).toEqual([1, 2, 6, 24]);
    });
  });

  describe("async", function () {
    it.each([
      [(a: number, b: number) => a * b, 1, [1, 2, 3, 4], [1, 1, 2, 6, 24]],
      [(a: string, b: string) => a + b, "a", ["b", "c"], ["a", "ab", "abc"]],
    ])(
      "should return value that is reduced given elements successively %s %s %s",
      async function (f, seed, iterable, result) {
        expect(
          await toArray(scan(f, seed, toAsync(iterable as any) as any)),
        ).toEqual(result);
      },
    );

    it.each([
      [(a: number, b: number) => a * b, 1, [1, 2, 3, 4], [1, 1, 2, 6, 24]],
      [(a: string, b: string) => a + b, "a", ["b", "c"], ["a", "ab", "abc"]],
    ])(
      "should reduce given elements successively when seed is Promise %s %s %s",
      async function (f, seed, iterable, result) {
        expect(
          await toArray(
            scan(f, Promise.resolve(seed), toAsync(iterable as any) as any),
          ),
        ).toEqual(result);
      },
    );

    it.each([
      [(a: number, b: number) => a * b, [1, 2, 3, 4], [1, 2, 6, 24]],
      [(a: string, b: string) => a + b, ["a", "b", "c"], ["a", "ab", "abc"]],
    ])(
      "should reduce given elements successively without seed %s %s %s",
      async function (f, iterable, result) {
        expect(await toArray(scan(f, toAsync(iterable as any) as any))).toEqual(
          result,
        );
      },
    );

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        [1, 2, 3, 4],
        toAsync,
        scan((a, b) => a * b),
        toArray,
      );

      expect(res).toEqual([1, 2, 6, 24]);
    });

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = scan((a) => a, mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });

    it("should be handled concurrently", async function () {
      const res = await pipe(
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        toAsync,
        map((a) => delay(200, a)),
        (nums) => scan((a, b) => a * b, 1, nums),
        concurrent(3),
        toArray,
      );

      expect(res).toEqual([1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880]);
    }, 650);

    it("should be handled concurrently without seed", async function () {
      const res = await pipe(
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        toAsync,
        map((a) => delay(200, a)),
        scan((a, b) => a * b),
        concurrent(3),
        toArray,
      );

      expect(res).toEqual([1, 2, 6, 24, 120, 720, 5040, 40320, 362880]);
    }, 650);

    it("should be able to handle an error when working concurrent", async function () {
      await expect(
        pipe(
          toAsync(range(1, 21)),
          map((a) => delay(100, a)),
          scan((a, b) => {
            if (a * b === 24) {
              throw new Error("err");
            }
            return a * b;
          }),
          concurrent(2),
          toArray,
        ),
      ).rejects.toThrow("err");
    });
  });
});
