import {
  concurrent,
  delay,
  map,
  pipe,
  toArray,
  toAsync,
  zip,
} from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { callFuncAfterTime, generatorMock } from "../utils";

describe("zip", function () {
  describe("sync", function () {
    it("should be merged values of each 'Iterable' with value at the corresponding position", function () {
      const res = toArray(
        zip(
          [1, 2, 3, 4], //
          [5, 6, 7, 8],
        ),
      );

      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    });

    it("should be zipped if the iterables have different size", function () {
      const res1 = toArray(
        zip(
          [1, 2, 3, 4], //
          [5, 6, 7, 8, 9],
        ),
      );

      expect(res1).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);

      const res2 = toArray(
        zip(
          [1, 2, 3, 4, 5], //
          [6, 7, 8, 9],
        ),
      );

      expect(res2).toEqual([
        [1, 6],
        [2, 7],
        [3, 8],
        [4, 9],
      ]);
    });

    it("should be able to be used in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, 4],
        (a) => zip(a, [5, 6, 7, 8]),
        map((nums) => [nums.reduce(sum)]),
        toArray,
      );

      expect(res).toEqual([[6], [8], [10], [12]]);
    });

    it("should be zipped each 'Iterable' having a different type", function () {
      const res = pipe(
        ["a", "b", "c", "d"],
        (a) => zip(a, [1, 2, 3, 4]),
        map((a) => Object.fromEntries([a])),
        toArray,
      );
      expect(res).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = pipe(
        // prettier-ignore
        [5, 6, 7, 8],
        zip([1, 2, 3, 4]),
        toArray,
      );

      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    });
  });

  const sum = (a: number, b: number) => a + b;

  describe("async", function () {
    it("should be merged values of each 'AsyncIterable' with value at the corresponding position", async function () {
      const res = await toArray(
        zip(
          // prettier-ignore
          toAsync([1, 2, 3, 4]),
          toAsync([5, 6, 7, 8]),
        ),
      );

      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    });

    it("should be zipped if the iterables have different size", async function () {
      const res1 = await toArray(
        zip(
          // prettier-ignore
          toAsync([1, 2, 3, 4]),
          toAsync([5, 6, 7, 8, 9]),
        ),
      );

      expect(res1).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);

      const res2 = await toArray(
        zip(
          // prettier-ignore
          toAsync([1, 2, 3, 4, 5]),
          toAsync([6, 7, 8, 9]),
        ),
      );

      expect(res2).toEqual([
        [1, 6],
        [2, 7],
        [3, 8],
        [4, 9],
      ]);
    });

    it("should be zipped 'Iterable' and 'AsyncIterable'", async function () {
      const res = await toArray(
        zip(
          [1, 2, 3, 4],
          // prettier-ignore
          toAsync([5, 6, 7, 8]),
        ),
      );

      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    });

    it("should be able to be used in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, 4]),
        (a) => zip(a, [5, 6, 7, 8]),
        map((nums) => [nums.reduce(sum)]),
        toArray,
      );

      expect(res).toEqual([[6], [8], [10], [12]]);
    });

    it("should be zipped each 'AsyncIterable' having a different type", async function () {
      const res = await pipe(
        ["a", "b", "c", "d"],
        (a) => zip(a, toAsync([1, 2, 3, 4])),
        map((a) => Object.fromEntries([a])),
        toArray,
      );
      expect(res).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }]);
    });

    it("should be zipped sequentially", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 4000);

      const res = await pipe(
        toAsync([5, 6, 7, 8]),
        map((nums) => delay(1000, nums)),
        zip([1, 2, 3, 4]),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    }, 4050);

    it("should be zipped concurrently: zip - map", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1000);

      const res = await pipe(
        toAsync([5, 6, 7, 8]),
        zip([1, 2, 3, 4]),
        map((nums) => delay(1000, nums)),
        concurrent(4),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    }, 1050);

    it("should be zipped concurrently: map - zip", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1000);

      const res = await pipe(
        toAsync([5, 6, 7, 8]),
        map((nums) => delay(1000, nums)),
        zip([1, 2, 3, 4]),
        concurrent(4),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    }, 1050);

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = zip([1, 2, 3], mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
