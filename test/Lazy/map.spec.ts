import { fx, map, pipe, range, toArray, toAsync } from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { generatorMock } from "../utils";

describe("map", function () {
  const add10 = (a: number) => a + 10;
  const add10Async = async (a: number) => a + 10;

  describe("sync", function () {
    it("should be mapped by the callback", function () {
      const acc = [];
      for (const a of map(add10, [1, 2, 3, 4, 5])) {
        acc.push(a);
      }
      expect(acc).toEqual([11, 12, 13, 14, 15]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, 4],
        map((a) => a),
        map((a) => String(a)),
        map((a) => a),
        toArray,
      );

      expect(res).toEqual(["1", "2", "3", "4"]);
    });

    it("should be able to be used as a chaining method in the `fx`", function () {
      const res = fx([1, 2, 3, 4])
        .map((a) => a)
        .map((a) => String(a))
        .map((a) => a)
        .toArray();

      expect(res).toEqual(["1", "2", "3", "4"]);
    });
  });

  describe("async", function () {
    it("should be mapped by the callback", async function () {
      const acc = [];
      for await (const a of map(add10, toAsync(range(1, 6, 1)))) {
        acc.push(a);
      }

      expect(acc).toEqual([11, 12, 13, 14, 15]);
    });

    it("should be mapped by the async callback", async function () {
      const acc = [];
      for await (const a of map(add10Async, toAsync(range(1, 6, 1)))) {
        acc.push(a);
      }

      expect(acc).toEqual([11, 12, 13, 14, 15]);
    });

    it("should be able to handle an error when asynchronous", async function () {
      await expect(
        toArray(
          map(() => {
            throw new Error("err");
          }, toAsync(range(1, 10))),
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to handle an error when asynchronous Promise.reject", async function () {
      await expect(
        toArray(
          map(() => Promise.reject(new Error("err")), toAsync(range(1, 10))),
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, 4]),
        map((a) => Promise.resolve(a)),
        map((a) => String(a)),
        map((a) => a),
        toArray,
      );

      expect(res).toEqual(["1", "2", "3", "4"]);
    });
    it("should be able to be used as a promise function", async function () {
      const res1 = map(async (a) => a, [1, 2, 3, 4]);

      expect(await Promise.all(res1)).toEqual([1, 2, 3, 4]);

      const res2 = pipe(
        [1, 2, 3, 4],
        map(async (a) => a),
      );

      expect(await Promise.all(res2)).toEqual([1, 2, 3, 4]);
    });

    it("should be able to be used as a chaining method in the `fx`", async function () {
      const res = await fx(toAsync([1, 2, 3, 4]))
        .map((a) => Promise.resolve(a))
        .map((a) => String(a))
        .toArray();

      expect(res).toEqual(["1", "2", "3", "4"]);
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
