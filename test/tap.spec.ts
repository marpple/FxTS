import { delay, map, pipe, range, tap, toArray, toAsync } from "../src";
import { callFuncAfterTime } from "./utils";

describe("tap", function () {
  describe("sync", function () {
    it("should return the received argument as it is", function () {
      const res = tap((a) => a * 100, 10);
      expect(res).toEqual(10);
    });

    it("should invoke the given callback once", function () {
      const fn = jest.fn((a: number) => a * 100);
      tap(fn, 10);
      expect(fn).toBeCalled();
    });

    it("should be curried when only one function is given as argument", function () {
      let res1 = 10;
      const res2 = tap((a: number) => {
        res1 += a;
        return res1;
      })(50);

      expect(res1).toEqual(60);
      expect(res2).toEqual(50);
    });
  });

  describe("async", function () {
    it("should return the received argument as it is", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1000);
      const res = await tap((a) => delay(1000, a), 10);
      expect(fn).toBeCalled();
      expect(res).toEqual(10);
    }, 1050);

    it("should support asynchronous when curried.", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 500);
      await pipe(range(5), toAsync, map(tap(() => delay(100))), toArray);
      expect(fn).toBeCalled();
    });
  });
});
