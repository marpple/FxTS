import {
  concat,
  concurrent,
  delay,
  map,
  pipe,
  toArray,
  toAsync,
} from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { callFuncAfterTime, generatorMock } from "../utils";

describe("concat", function () {
  describe("sync", function () {
    it("should be concatenated given two 'Iterable'", function () {
      const res = [...concat([1, 2, 3], [4, 5, 6])];
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe([4, 5, 6], concat([1, 2, 3]), toArray);
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe("async", function () {
    it("should be concatenated given two 'AsyncIterable'", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 4000);
      const res = await pipe(
        [
          map((a) => delay(1000, a), toAsync([1, 2])),
          map((a) => delay(1000, a), toAsync([3, 4])),
        ],
        ([a, b]) => concat(a, b),
        toArray,
      );
      expect(fn).toBeCalled();
      expect(res).toEqual([1, 2, 3, 4]);
    }, 4050);

    it("should be concatenated given two 'AsyncIterable' concurrently", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 3000);
      const res = await pipe(
        [
          map((a) => delay(1000, a), toAsync([1, 2, 3])),
          map((a) => delay(1000, a), toAsync([4, 5, 6])),
        ],
        ([a, b]) => concat(a, b),
        concurrent(2),
        toArray,
      );
      expect(fn).toBeCalled();
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    }, 3050);

    it("should be concatenated given 'Iterable' 'AsyncIterable'", async function () {
      const res1 = await pipe(
        toAsync([1, 2, 3]),
        (a) => concat(a, [4, 5, 6]),
        toArray,
      );
      expect(res1).toEqual([1, 2, 3, 4, 5, 6]);

      const res2 = await pipe(
        [1, 2, 3],
        (a) => concat(a, toAsync([4, 5, 6])),
        toArray,
      );
      expect(res2).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should be concatenated given 'AsyncIterable' 'AsyncIterable'", async function () {
      const res = await pipe(
        toAsync([4, 5, 6]),
        concat(toAsync([1, 2, 3])),
        toArray,
      );
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should be concatenated given 'AsyncIterable' 'Iterable'", async function () {
      const res = await pipe(
        toAsync([4, 5, 6]), //
        concat([1, 2, 3]),
        toArray,
      );
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should be concatenated given 'Iterable' 'AsyncIterable'", async function () {
      const res = await pipe(
        [4, 5, 6], //
        concat(toAsync([1, 2, 3])),
        toArray,
      );
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = concat(mock, [1, 2, 3]);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
