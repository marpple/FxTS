import {
  concurrent,
  delay,
  // fx,
  join,
  map,
  pipe,
  sum,
  take,
  toArray,
  toAsync,
  transpose,
  zip,
} from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { generatorMock } from "../utils";

describe("transpose", function () {
  describe("sync", function () {
    it("should be merged values of each 'Iterable' with value at the corresponding position", function () {
      const res = toArray(transpose([1, 5], [2, 6], [3, 7], [4, 8]));

      expect(res).toEqual([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
      ]);
    });

    it("should be transposed if the iterables have different size", function () {
      const res = toArray(transpose([1, 2], [3], [], [4, 5, 6], [7], [8, 9]));

      expect(res).toEqual([[1, 3, 4, 7, 8], [2, 5, 9], [6]]);
    });

    it("should be able to be used in the pipeline", function () {
      const res = pipe(
        [1, 5],
        (a) => transpose(a, [2, 6], [3, 7], [4, 8, 9]),
        take(2),
        map(sum),
        toArray,
      );

      expect(res).toEqual([10, 26]);
    });

    it("should be transposed each 'Iterable' having a different type", function () {
      const res = pipe(
        ["a", 1],
        (a) => transpose(a, ["b", 2], ["c", 3]),
        map((value) => join("-", value)),
        toArray,
      );

      expect(res).toEqual(["a-b-c", "1-2-3"]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = pipe([5, 6, 7, 8], transpose([1, 2, 3, 4]), toArray);

      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    });

    // TODO: FX 부분 추가할 것
    it("should be able to be used as a chaining method in the `fx`", function () {
      // const res1 = fx([1, 2, 3]).transpose(["5", "6", "7", "8"]).toArray();
      // expect(res1).toEqual([["5", 1], ["6", 2], ["7", 3], ["8"]]);
    });
  });

  describe("async", function () {
    it("should be merged values of each 'AsyncIterable' with value at the corresponding position", async function () {
      const res = await toArray(
        transpose(
          toAsync([1, 5]),
          toAsync([2, 6]),
          toAsync([3, 7]),
          toAsync([4, 8]),
        ),
      );

      expect(res).toEqual([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
      ]);
    });

    it("should be transposed if the iterables have different size", async function () {
      const res = await toArray(
        transpose(
          toAsync([1, 2]),
          toAsync([3]),
          toAsync([]),
          toAsync([4, 5, 6]),
          toAsync([7]),
          toAsync([8, 9]),
        ),
      );

      expect(res).toEqual([[1, 3, 4, 7, 8], [2, 5, 9], [6]]);
    });

    it("should be transposed 'Iterable' and 'AsyncIterable'", async function () {
      const res = await toArray(
        transpose(
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
        (a) => transpose(a, [5, 6, 7, 8]),
        toArray,
      );

      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    });

    // TODO: FX 부분 추가할 것
    // it("should be able to be used as a chaining method in the `fx`", async function () {});

    it("should be transposed each 'AsyncIterable' having a different type", async function () {
      const res = await pipe(
        ["a", "b", "c", "d"],
        (a) => transpose(a, toAsync([1, 2, 3, 4])),
        map((a) => Object.fromEntries([a])),
        toArray,
      );
      expect(res).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }]);
    });

    it("should be transposed sequentially", async function () {
      const res = await pipe(
        toAsync([5, 6, 7, 8]),
        map((nums) => delay(1000, nums)),
        transpose([1, 2, 3, 4]),
        toArray,
      );

      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    }, 4050);

    it("should be transposed concurrently: transpose - map", async function () {
      const res = await pipe(
        toAsync([5, 6, 7, 8]),
        transpose([1, 2, 3, 4]),
        map((nums) => delay(1000, nums)),
        concurrent(4),
        toArray,
      );

      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    }, 1050);

    it("should be transposed concurrently: map - transpose", async function () {
      const res = await pipe(
        toAsync([5, 6, 7, 8]),
        map((nums) => delay(1000, nums)),
        transpose([1, 2, 3, 4]),
        concurrent(4),
        toArray,
      );

      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    }, 1050);

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = transpose([1, 2, 3], mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
