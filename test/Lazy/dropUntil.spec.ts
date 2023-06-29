import {
  concurrent,
  delay,
  dropUntil,
  filter,
  map,
  pipe,
  toArray,
  toAsync,
} from "../../src";
import { AsyncFunctionException } from "../../src/_internal/error";
import { Concurrent } from "../../src/Lazy/concurrent";
import { callFuncAfterTime, generatorMock } from "../utils";

describe("dropUntil", function () {
  describe("sync", function () {
    it("should be dropped elements until the value applied to callback returns truly", function () {
      const arr = [1, 2, 3, 4, 5, 1, 2];
      const acc = [];
      for (const a of dropUntil((a) => a > 3, arr)) {
        acc.push(a);
      }
      expect(acc).toEqual([5, 1, 2]);
    });

    it("should throw an error when the callback is asynchronous", function () {
      const res = () => [...dropUntil(async (a) => a > 5, [1, 2, 3, 4, 5])];
      expect(res).toThrowError(new AsyncFunctionException());
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, 4, 5, 1, 2],
        map((a) => a + 10),
        filter((a) => a % 2 === 1),
        dropUntil((a) => a > 13),
        toArray,
      );

      expect(res).toEqual([11]);
    });
  });

  describe("async", function () {
    it("should be dropped elements until the value applied to callback returns truly", async function () {
      const arr = [1, 2, 3, 4, 5, 1, 2];
      const acc = [];
      for await (const a of dropUntil((a) => a > 3, toAsync(arr))) {
        acc.push(a);
      }
      expect(acc).toEqual([5, 1, 2]);
    });

    it("should be dropped elements until the value applied to async callback returns truly", async function () {
      const arr = [1, 2, 3, 4, 5, 1, 2];
      const acc = [];
      for await (const a of dropUntil(async (a) => a > 3, toAsync(arr))) {
        acc.push(a);
      }
      expect(acc).toEqual([5, 1, 2]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        [1, 2, 3, 4, 5, 1, 2],
        toAsync,
        map((a) => a + 10),
        filter((a) => a % 2 === 1),
        dropUntil((a) => a > 13),
        toArray,
      );

      expect(res).toEqual([11]);
    });

    it("should be able to handle an error when asynchronous", async function () {
      await expect(
        pipe(
          toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
          dropUntil((a) => {
            if (a > 5) {
              throw new Error("err");
            }
            return false;
          }),
          toArray,
        ),
      ).rejects.toThrow("err");
    });

    it("should be dropped elements concurrently", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1500);
      const res = await pipe(
        [1, 2, 3, 4, 5, 1, 2],
        toAsync,
        map((a) => delay(500, a + 10)),
        filter((a) => a % 2 === 1),
        dropUntil((a) => a > 13),
        concurrent(3),
        toArray,
      );
      expect(fn).toBeCalled();
      expect(res).toEqual([11]);
    }, 1550);

    it("should be controlled the order when concurrency", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 2000);

      const res = await pipe(
        toAsync(
          (function* () {
            yield delay(1000, 1);
            yield delay(900, 2);
            yield delay(800, 3);
            yield delay(700, 4);
            yield delay(600, 5);
            yield delay(1000, 11);
            yield delay(900, 12);
            yield delay(800, 13);
            yield delay(700, 8);
            yield delay(600, 9);
          })(),
        ),
        dropUntil((a) => a > 12),
        concurrent(5),
        toArray,
      );
      expect(fn).toBeCalled();
      expect(res).toEqual([8, 9]);
    }, 2050);

    it("should be able to handle an error when working concurrent", async function () {
      await expect(
        pipe(
          toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
          dropUntil((a) => {
            if (a > 5) {
              throw new Error("err");
            }
            return false;
          }),
          concurrent(3),
          toArray,
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to handle an error when working concurrent - Promise.reject", async function () {
      await expect(
        pipe(
          toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
          dropUntil((a) => {
            if (a > 5) {
              return Promise.reject(new Error("err"));
            }
            return false;
          }),
          concurrent(3),
          toArray,
        ),
      ).rejects.toThrow("err");
    });

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = dropUntil((a) => a, mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
