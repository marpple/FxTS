import { AsyncFunctionException } from "../../src/_internal/error";
import {
  concurrent,
  delay,
  dropWhile,
  filter,
  map,
  pipe,
  toArray,
  toAsync,
} from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { callFuncAfterTime, generatorMock } from "../utils";

describe("dropWhile", function () {
  describe("sync", function () {
    it("should be dropped elements until the value applied to callback returns falsey", function () {
      const acc = [];
      for (const a of dropWhile((a) => a < 3, [1, 2, 3, 1, 5])) {
        acc.push(a);
      }
      expect(acc).toEqual([3, 1, 5]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, 4, 5, 6, 7, 8],
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        dropWhile((a) => a < 16),
        toArray,
      );

      expect(res).toEqual([16, 18]);
    });

    it("should throw an error when the callback is asynchronous", function () {
      const res = () => [...dropWhile(async (a) => a > 5, [1, 2, 3, 4, 5])];
      expect(res).toThrowError(new AsyncFunctionException());
    });
  });

  describe("async", function () {
    it("should be dropped elements until the value applied to callback returns falsey", async function () {
      const acc = [];
      for await (const a of dropWhile((a) => a < 3, toAsync([1, 2, 3, 1, 5]))) {
        acc.push(a);
      }
      expect(acc).toEqual([3, 1, 5]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, 4, 5, 6, 7, 8]),
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        dropWhile((a) => a < 16),
        toArray,
      );

      expect(res).toEqual([16, 18]);
    });

    it("should be able to handle an error when asynchronous", async function () {
      await expect(
        pipe(
          toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
          dropWhile((a) => {
            if (a > 5) {
              throw new Error("err");
            }
            return true;
          }),
          toArray,
        ),
      ).rejects.toThrow("err");
    });

    it("should be dropped elements concurrently", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 400);
      const res = await pipe(
        toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
        map((a) => delay(100, a)),
        filter((a) => a % 2 === 0),
        dropWhile((a) => a < 6),
        concurrent(3),
        toArray,
      );
      expect(fn).toBeCalled();
      expect(res).toEqual([6, 8, 10]);
    }, 450);

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
            yield delay(1000, 6);
            yield delay(900, 7);
            yield delay(800, 8);
            yield delay(700, 1);
            yield delay(600, 10);
          })(),
        ),
        dropWhile((a) => a < 7),
        concurrent(5),
        toArray,
      );
      expect(fn).toBeCalled();
      expect(res).toEqual([7, 8, 1, 10]);
    }, 2050);

    it("should be able to handle an error when working concurrent", async function () {
      await expect(
        pipe(
          toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
          dropWhile((a) => {
            if (a > 5) {
              throw new Error("err");
            }
            return true;
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
          dropWhile((a) => {
            if (a > 5) {
              return Promise.reject(new Error("err"));
            }
            return true;
          }),
          concurrent(3),
          toArray,
        ),
      ).rejects.toThrow("err");
    });

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = dropWhile((a) => a, mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
