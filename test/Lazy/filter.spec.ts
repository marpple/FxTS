import { AsyncFunctionException } from "../../src/_internal/error";
import {
  concurrent,
  delay,
  filter,
  map,
  pipe,
  range,
  take,
  toArray,
  toAsync,
} from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { callFuncAfterTime, generatorMock } from "../utils";

const mod = (a: number) => a % 2 === 0;
const modAsync = async (a: number) => a % 2 === 0;

describe("filter", function () {
  describe("sync", function () {
    it("should be filtered by the callback", function () {
      const res = [...filter(mod, range(1, 10))];
      expect(res).toEqual([2, 4, 6, 8]);
    });

    it("should be filtered by the boolean constructor", function () {
      const res = [
        ...filter(Boolean, [undefined, null, 0, "", false, -0, 123]),
      ];
      expect(res).toEqual([123]);
    });

    it("should throw an error when the callback is asynchronous", function () {
      const res = () => [...filter(modAsync, range(1, 10))];
      expect(res).toThrowError(new AsyncFunctionException());
    });

    it("should be able to handle an error", function () {
      try {
        filter(() => {
          throw "err";
        }, range(1, 10));
      } catch (err) {
        expect(err).toEqual("err");
      }
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, 4],
        filter((a) => a % 2 === 0),
        toArray,
      );

      expect(res).toEqual([2, 4]);
    });
  });

  describe("async", function () {
    it("should be filtered by the callback", async function () {
      const res: number[] = [];
      const iter = filter(modAsync, toAsync(range(1, 10)));
      for await (const item of iter) {
        res.push(item);
      }
      expect(res).toEqual([2, 4, 6, 8]);
    });

    it("should be filtered by the boolean constructor", async function () {
      const res: unknown[] = [];
      const iter = filter(
        Boolean,
        toAsync([undefined, null, 0, "", false, -0, 123]),
      );
      for await (const item of iter) {
        res.push(item);
      }
      expect(res).toEqual([123]);
    });

    it("should be able to handle an error", async function () {
      try {
        await toArray(
          filter(() => {
            throw "err";
          }, toAsync(range(1, 10))),
        );
      } catch (err) {
        expect(err).toEqual("err");
      }
    });

    it("should be able to handle an error when the callback is asynchronous", async function () {
      try {
        await toArray(
          filter(() => Promise.reject("err"), toAsync(range(1, 10))),
        );
      } catch (err) {
        expect(err).toEqual("err");
      }
    });

    it("should be able to handle an error when working concurrent", async function () {
      const gen = toAsync(range(1, 51));
      try {
        await pipe(
          gen,
          filter((a) => {
            if (a === 7) {
              throw "err";
            }
            return a % 2 === 0;
          }),
          concurrent(5),
          toArray,
        );
      } catch (err) {
        expect(err).toEqual("err");
      }
      const { value } = await gen.next();
      expect(value).toEqual(11);
    });

    it("should be filtered by callback concurrently", async function () {
      const res = await pipe(
        toAsync(range(1, 21)),
        filter((a) => delay(1000, a % 2 === 0)),
        concurrent(10),
        toArray,
      );

      expect(res).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
    }, 2050);

    it("should be able to call with 'next'", async function () {
      const res = pipe(
        toAsync(range(1, 20)),
        map((a) => delay(100, a)),
        filter((a) => a % 2 === 0 || a % 3 === 0),
        concurrent(2),
      );

      const { value: v1 } = await res.next();
      const { value: v2 } = await res.next();
      const { value: v3 } = await res.next();
      const { value: v4 } = await res.next();
      const { value: v5 } = await res.next();

      expect(v1 + v2 + v3 + v4 + v5).toEqual(2 + 3 + 4 + 6 + 8);
    }, 2050);

    it("should be empty when all elements are filtered", async function () {
      const res = await pipe(
        toAsync(range(1, 20)),
        filter(() => delay(100, false)),
        concurrent(2),
        toArray,
      );
      expect(res).toEqual([]);
    }, 1050);

    it("should be having all elements when all elements are not filtered", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1000);

      const res = await pipe(
        toAsync(range(1, 20)),
        filter(() => delay(100, true)),
        concurrent(2),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      ]);
    }, 1050);

    it("should be filtered by the callback 'take' - 'filter' - 'concurrent'", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 2000);

      const res = await pipe(
        toAsync(range(1, 21)),
        take(10),
        filter((a) => delay(1000, a % 2 === 0)),
        concurrent(5),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual([2, 4, 6, 8, 10]);
    }, 2050);

    it("should be filtered by the callback 'filter' - 'take' - 'concurrent'", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1000);

      const res = await pipe(
        toAsync(range(1, 51)),
        filter((a) => delay(500, a % 2 === 0)),
        take(10),
        concurrent(10),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
    }, 1050);

    it("should be filtered by the callback 'map' - 'filter' - 'concurrent'", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1000);

      const res = await pipe(
        toAsync(range(1, 21)),
        map((a) => delay(500, a + 10)),
        filter((a) => a % 2 === 0),
        concurrent(10),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual([12, 14, 16, 18, 20, 22, 24, 26, 28, 30]);
    }, 1050);

    it("should be filtered by the callback 'map' - 'filter' - 'concurrent' - 'take'", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1000);

      const res = await pipe(
        toAsync(range(1, 10)),
        map((a) => delay(500, a)),
        filter((a) => a),
        concurrent(5),
        take(8),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual([...range(1, 9)]);
    }, 1050);

    it("should be able to handle an error when the callback is asynchronous", async function () {
      await expect(
        pipe(
          toAsync(range(1, 1000)),
          map((a) => delay(500, a + 10)),
          filter((a) => {
            if (a === 14) {
              throw new Error("err");
            }
            return a > 20;
          }),
          concurrent(2),
          toArray,
        ),
      ).rejects.toThrow("err");
    }, 1050);

    it("should be able to handle errors when the callback is asynchronous", async function () {
      await expect(
        pipe(
          toAsync(range(1, 1000)),
          map(async () => {
            await delay(100);
            throw new Error("err");
          }),
          filter((a) => a % 2 === 0),
          concurrent(4),
          toArray,
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, 4]),
        filter((a) => a % 2 === 0),
        toArray,
      );

      expect(res).toEqual([2, 4]);
    });

    it("should be consumed 'AsyncIterable' as many times as called with 'next'", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 2000);
      const iterator = toAsync(range(1, 21));
      const res = pipe(
        iterator,
        map((a) => delay(500, a)),
        filter((a) => a % 2 === 0),
        concurrent(3),
      );

      const { value: v1 } = await res.next();
      const { value: v2 } = await res.next();
      const { value: v3 } = await res.next();
      const { value: v4 } = await res.next();
      const { value: v5 } = await res.next(); // 10
      expect(fn).toBeCalled();
      expect(v1).toEqual(2);
      expect(v2).toEqual(4);
      expect(v3).toEqual(6);
      expect(v4).toEqual(8);
      expect(v5).toEqual(10);

      const { value: v6 } = await iterator.next();
      expect(v6).toEqual(13);
    }, 2050);

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = filter((a) => a, mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
