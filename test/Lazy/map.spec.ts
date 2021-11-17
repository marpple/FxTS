import { map, pipe, range, toArray, toAsync } from "../../src/index";
import { AsyncFunctionException } from "../../src/_internal/error";

describe("map", () => {
  const add10 = (a: number) => a + 10;
  const add10Async = async (a: number) => a + 10;

  describe("sync", () => {
    it("should be mapped by the callback", () => {
      const acc = [];
      for (const a of map(add10, [1, 2, 3, 4, 5])) {
        acc.push(a);
      }
      expect(acc).toEqual([11, 12, 13, 14, 15]);
    });

    it("should throw an error when the callback is asynchronous", () => {
      const res = () => [...map(add10Async, [1, 2, 3, 4, 5])];
      expect(res).toThrowError(new AsyncFunctionException());
    });

    it("should be able to be used as a curried function in the pipeline", () => {
      const res = pipe(
        [1, 2, 3, 4],
        map((a) => a),
        map((a) => String(a)),
        map((a) => a),
        toArray,
      );

      expect(res).toEqual(["1", "2", "3", "4"]);
    });
  });

  describe("async", () => {
    it("should be mapped by the callback", async () => {
      const acc = [];
      for await (const a of map(add10, toAsync(range(1, 6, 1)))) {
        acc.push(a);
      }

      expect(acc).toEqual([11, 12, 13, 14, 15]);
    });

    it("should be mapped by the async callback", async () => {
      const acc = [];
      for await (const a of map(add10Async, toAsync(range(1, 6, 1)))) {
        acc.push(a);
      }

      expect(acc).toEqual([11, 12, 13, 14, 15]);
    });

    it("should be able to handle an error when asynchronous", async () => {
      await expect(
        toArray(
          map(() => {
            throw new Error("err");
          }, toAsync(range(1, 10))),
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to handle an error when asynchronous Promise.reject", async () => {
      await expect(
        toArray(
          map(() => Promise.reject(new Error("err")), toAsync(range(1, 10))),
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to be used as a curried function in the pipeline", async () => {
      const res = await pipe(
        toAsync([1, 2, 3, 4]),
        map((a) => Promise.resolve(a)),
        map((a) => String(a)),
        map((a) => a),
        toArray,
      );

      expect(res).toEqual(["1", "2", "3", "4"]);
    });
  });
});
