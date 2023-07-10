import { AsyncFunctionException } from "../../src/_internal/error";
import {
  concurrent,
  delay,
  filter,
  map,
  pipe,
  range,
  takeWhile,
  toArray,
  toAsync,
} from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { generatorMock } from "../utils";

describe("takeWhile", function () {
  describe("sync", function () {
    it("should be able to take the element while the callback result is truthy", function () {
      const res = [];
      for (const item of takeWhile((a) => a < 3, [1, 2, 3, 4])) {
        res.push(item);
      }
      expect(res).toEqual([1, 2]);

      const res1 = toArray(takeWhile((a) => a > 10, [1, 2, 3, 4]));
      expect(res1).toEqual([]);

      const res2 = toArray(takeWhile((a) => a > 0, [1, 2, 3, 4]));
      expect(res2).toEqual([1, 2, 3, 4]);
    });

    it("should throw an error when the callback is asynchronous", function () {
      const res = () => [...takeWhile(async (a) => a < 3, [1, 2, 3, 4])];
      expect(res).toThrowError(new AsyncFunctionException());
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        range(1, 20),
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        takeWhile((a) => a < 20),
        toArray,
      );

      expect(res).toEqual([12, 14, 16, 18]);
    });
  });

  describe("async", function () {
    it("should be able to take the element while the callback result is truthy", async function () {
      const res = [];
      // prettier-ignore
      for await (const item of takeWhile((a) => a < 3,toAsync( [1, 2, 3, 4]))) {
        res.push(item);
      }
      expect(res).toEqual([1, 2]);

      // prettier-ignore
      const res1 = await toArray(takeWhile((a) => a >10, toAsync([1, 2, 3, 4])));
      expect(res1).toEqual([]);

      const res2 = await toArray(
        takeWhile((a) => a > 0, toAsync([1, 2, 3, 4])),
      );
      expect(res2).toEqual([1, 2, 3, 4]);
    });

    it("should be able to take the element while the async callback result is truthy", async function () {
      const res = [];
      // prettier-ignore
      for await (const item of takeWhile(async (a) => a < 3,toAsync( [1, 2, 3, 4]))) {
        res.push(item);
      }
      expect(res).toEqual([1, 2]);

      // prettier-ignore
      const res1 = await toArray(takeWhile(async(a) => a > 10, toAsync([1, 2, 3, 4])));
      expect(res1).toEqual([]);

      // prettier-ignore
      const res2 = await toArray(takeWhile(async(a) => a > 0, toAsync([1, 2, 3, 4])));
      expect(res2).toEqual([1, 2, 3, 4]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync(range(1, 20)),
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        takeWhile((a) => a < 20),
        toArray,
      );

      expect(res).toEqual([12, 14, 16, 18]);
    });

    it("should be consumed 'AsyncIterable' as many times as called with 'next'", async function () {
      const res = pipe(
        toAsync(range(1, 500)),
        map((a) => delay(100, a + 10)),
        takeWhile((a) => a < 16),
        concurrent(2),
      );

      const { value: v1 } = await res.next();
      const { value: v2 } = await res.next();
      const { value: v3 } = await res.next();
      const { value: v4 } = await res.next();
      const { value: v5 } = await res.next();
      const { value: v6 } = await res.next();
      const { value: v7 } = await res.next();

      expect(v1 + v2 + v3 + v4 + v5).toEqual(11 + 12 + 13 + 14 + 15);
      expect(v6).toEqual(undefined);
      expect(v7).toEqual(undefined);
    }, 450);

    it("should be able to take the element concurrently", async function () {
      const res = await pipe(
        toAsync(range(1, 500)),
        map((a) => delay(100, a + 10)),
        filter((a) => a % 2 === 0),
        takeWhile((a) => a < 22),
        concurrent(2),
        toArray,
      );

      expect(res).toEqual([12, 14, 16, 18, 20]);
    }, 650);
  });

  it("should be passed concurrent object when job works concurrently", async function () {
    const mock = generatorMock();
    const iter = takeWhile((a) => a, mock);
    const concurrent = Concurrent.of(2) as any;

    await iter.next(concurrent);
    expect((mock as any).getConcurrent()).toEqual(concurrent);
  });

  it("should be able to handle an error when asynchronous", async function () {
    await expect(
      pipe(
        range(Infinity),
        toAsync,
        map((a) => delay(100, a + 10)),
        filter((a) => a % 2 === 0),
        takeWhile((a) => {
          if (a > 15) {
            throw new Error("err");
          }
          return true;
        }),
        concurrent(5),
        toArray,
      ),
    ).rejects.toThrow("err");
  }, 350);

  it("should be controlled the order when concurrency", async function () {
    const res = await pipe(
      toAsync(
        (function* () {
          yield delay(500, 1);
          yield delay(400, 2);
          yield delay(300, 3);
          yield delay(200, 4);
          yield delay(100, 5);
          yield delay(500, 6);
          yield delay(400, 7);
          yield delay(300, 8);
          yield delay(200, 9);
        })(),
      ),
      takeWhile((a) => a < 8),
      concurrent(5),
      toArray,
    );
    expect(res).toEqual([1, 2, 3, 4, 5, 6, 7]);
  }, 1050);
});
