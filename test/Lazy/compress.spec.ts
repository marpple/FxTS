import { compress, map, pipe, toArray, toAsync } from "../../src";
import { Concurrent } from "../../src/Lazy/concurrent";
import { generatorMock } from "../utils";

describe("compress", function () {
  describe("sync", function () {
    it.each([
      [
        [false, true, false, false, true],
        [1, 2, 3, 4, 5],
        [2, 5],
      ],
      [
        [false, true, false, false, true],
        [1, 2, 3, 4, 5, 6],
        [2, 5],
      ],
      [[false, true, false, false, true], [1, 2, 3, 4], [2]],
      [[1, 0, 0, 1, 0], "abcde", ["a", "d"]],
    ])(
      "should filter elements that have a corresponding element in 'selectors'",
      function (selectors, iterable, result) {
        const res = compress(
          selectors as Array<any>,
          iterable as Iterable<any>,
        );
        expect(toArray(res)).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, 4, 5],
        compress([false, true, false, false, true]),
        toArray,
      );

      expect(res).toEqual([2, 5]);
    });
  });

  describe("async", function () {
    it.each([
      [
        [false, true, false, false, true],
        [1, 2, 3, 4, 5],
        [2, 5],
      ],
      [
        [false, true, false, false, true],
        [1, 2, 3, 4, 5, 6],
        [2, 5],
      ],
      [[false, true, false, false, true], [1, 2, 3, 4], [2]],
      [[1, 0, 0, 1, 0], "abcde", ["a", "d"]],
    ])(
      "should filter elements that have a corresponding element in 'selectors'",
      async function (selectors, iterable, result) {
        const res = compress(
          selectors as Array<any>,
          iterable as Iterable<any>,
        );
        expect(await toArray(toAsync(res))).toEqual(result);
      },
    );

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        [1, 2, 3, 4, 5],
        toAsync,
        compress([false, true, false, false, true]),
        toArray,
      );

      expect(res).toEqual([2, 5]);
    });

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = map((a) => a, mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
