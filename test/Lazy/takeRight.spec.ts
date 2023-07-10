import {
  concurrent,
  delay,
  filter,
  map,
  pipe,
  range,
  takeRight,
  toArray,
  toAsync,
} from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { callFuncAfterTime, generatorMock } from "../utils";

describe("takeRight", function () {
  describe("sync", function () {
    it("should be able to take the element", function () {
      const res = [];
      for (const item of takeRight(1, [1, 2, 3, 4])) {
        res.push(item);
      }
      expect(res).toEqual([4]);

      const res0 = toArray(takeRight(0, [1, 2, 3, 4]));
      expect(res0).toEqual([]);

      const res1 = toArray(takeRight(1, [1, 2, 3, 4]));
      expect(res1).toEqual([4]);

      const res2 = toArray(takeRight(2, [1, 2, 3, 4]));
      expect(res2).toEqual([3, 4]);

      const res3 = toArray(takeRight(3, [1, 2, 3, 4]));
      expect(res3).toEqual([2, 3, 4]);

      const res4 = toArray(takeRight(4, [1, 2, 3, 4]));
      expect(res4).toEqual([1, 2, 3, 4]);

      const res5 = toArray(takeRight(5, [1, 2, 3, 4]));
      expect(res5).toEqual([1, 2, 3, 4]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res1 = pipe(
        [1, 2, 3, 4, 5, 6],
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        takeRight(2),
        toArray,
      );

      expect(res1).toEqual([14, 16]);
    });

    it("should be able to take the rest element", async function () {
      const iter = takeRight(5, range(1, 11));
      iter.next();
      iter.next();
      let sum = 0;
      for (const item of iter) {
        sum += item;
      }
      expect(sum).toEqual(8 + 9 + 10);
    });
  });

  describe("async", function () {
    it("should be able to take the element", async function () {
      const res = [];
      for await (const item of takeRight(1, toAsync([1, 2, 3, 4]))) {
        res.push(item);
      }
      expect(res).toEqual([4]);

      const res0 = await toArray(takeRight(0, toAsync([1, 2, 3, 4])));
      expect(res0).toEqual([]);

      const res1 = await toArray(takeRight(1, toAsync([1, 2, 3, 4])));
      expect(res1).toEqual([4]);

      const res2 = await toArray(takeRight(2, toAsync([1, 2, 3, 4])));
      expect(res2).toEqual([3, 4]);

      const res3 = await toArray(takeRight(3, toAsync([1, 2, 3, 4])));
      expect(res3).toEqual([2, 3, 4]);

      const res4 = await toArray(takeRight(4, toAsync([1, 2, 3, 4])));
      expect(res4).toEqual([1, 2, 3, 4]);

      const res5 = await toArray(takeRight(5, toAsync([1, 2, 3, 4])));
      expect(res5).toEqual([1, 2, 3, 4]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res1 = await pipe(
        toAsync([1, 2, 3, 4, 5, 6]),
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        takeRight(2),
        toArray,
      );

      expect(res1).toEqual([14, 16]);
    });

    it("should be able to take the element concurrently", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 400);
      const res = await pipe(
        toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
        map((a) => delay(100, a)),
        filter((a) => a % 2 === 0),
        takeRight(3),
        concurrent(3),
        toArray,
      );
      expect(fn).toBeCalled();
      expect(res).toEqual([6, 8, 10]);
    }, 450);

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = takeRight(1, mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
