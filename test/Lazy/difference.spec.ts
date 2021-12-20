import { delay, map, pipe, toArray, toAsync } from "../../src";
import concurrent, { Concurrent } from "../../src/Lazy/concurrent";
import difference from "../../src/Lazy/difference";
import { callFuncAfterTime, generatorMock } from "../utils";

describe("difference", function () {
  describe("sync", function () {
    it.each([
      [
        [1, 2, 3, 4],
        [3, 4, 5, 6, 5, 3],
        [5, 6],
      ],
      ["abcd", "cdefg", ["e", "f", "g"]],
    ])(
      "should return all elements in %o not contained %o",
      function (iterable1, iterable2, result) {
        const iter = difference(iterable1 as any, iterable2 as any);
        expect(toArray(iter)).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe([1, 2, 3, 4], difference([2, 4, 5, 6]), toArray);
      expect(res).toEqual([1, 3]);
    });
  });

  describe("async", function () {
    it.each([
      [toAsync([1, 2, 3, 4]), toAsync([3, 4, 5, 6, 5, 3]), [5, 6]],
      [[1, 2, 3, 4], toAsync([3, 4, 5, 6]), [5, 6]],
      [toAsync([1, 2, 3, 4]), [3, 4, 5, 6], [5, 6]],
      ["abcd", "cdefg", ["e", "f", "g"]],
    ])(
      "should return all elements in iterable1 not contained iterable2",
      async function (iterable1, iterable2, result) {
        const iter = difference(
          iterable1 as AsyncIterable<any>,
          iterable2 as AsyncIterable<any>,
        );
        expect(await toArray(iter)).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, 4]),
        difference([2, 4, 5, 6]),
        toArray,
      );
      expect(res).toEqual([1, 3]);
    });

    it("should be handled concurrently", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 900);

      const res = await pipe(
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        toAsync,
        map((a) => delay(300, a)),
        difference([3, 4, 5]),
        concurrent(3),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual([1, 2, 6, 7, 8, 9]);
    }, 950);

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock1 = generatorMock();
      const mock2 = generatorMock();
      const iter = difference(mock1, mock2);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      // mock2 only concurrent
      expect((mock2 as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
