import {
  concurrent,
  delay,
  drop,
  filter,
  map,
  pipe,
  toArray,
  toAsync,
} from "../../src/index";

import { callFuncAfterTime } from "../utils";

describe("drop", () => {
  describe("sync", () => {
    it("should be discarded elements by length", () => {
      const acc = [];
      for (const a of drop(2, [1, 2, 3, 4, 5])) {
        acc.push(a);
      }
      expect(acc).toEqual([3, 4, 5]);
    });

    it("should be able to be used as a curried function in the pipeline", () => {
      const res = pipe(
        [1, 2, 3, 4, 5, 6, 7, 8],
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        drop(2),
        toArray,
      );

      expect(res).toEqual([16, 18]);
    });
  });

  describe("async", () => {
    it("should be discarded elements by length", async () => {
      const acc = [];
      for await (const a of drop(2, toAsync([1, 2, 3, 4, 5]))) {
        acc.push(a);
      }
      expect(acc).toEqual([3, 4, 5]);
    });

    it("should be able to be used as a curried function in the pipeline", async () => {
      const res = await pipe(
        toAsync([1, 2, 3, 4, 5, 6, 7, 8]),
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        drop(2),
        toArray,
      );

      expect(res).toEqual([16, 18]);
    });

    it("should be discarded elements by length concurrently", async () => {
      const fn = jest.fn();
      callFuncAfterTime(fn, 400);
      const res = await pipe(
        toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
        map((a) => delay(100, a)),
        filter((a) => a % 2 === 0),
        drop(2),
        concurrent(3),
        toArray,
      );
      expect(fn).toBeCalled();
      expect(res).toEqual([6, 8, 10]);
    }, 450);

    it("should be able to handle an error when asynchronous", async () => {
      await expect(
        pipe(
          toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
          filter(() => {
            throw new Error("err");
          }),
          drop(2),
          toArray,
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to handle an error when working concurrent", async () => {
      await expect(
        pipe(
          toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
          filter((a) => {
            if (a === 1) {
              throw new Error("err");
            } else return true;
          }),
          drop(2),
          concurrent(3),
          toArray,
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to handle an error when working concurrent - Promise.reject", async () => {
      await expect(
        pipe(
          toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
          map((a) => {
            if (a < 3) return Promise.reject(new Error("err"));
            else return a;
          }),
          drop(2),
          concurrent(3),
          toArray,
        ),
      ).rejects.toThrow("err");
    });
  });
});
