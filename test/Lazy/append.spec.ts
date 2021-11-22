import {
  append,
  concurrent,
  delay,
  map,
  pipe,
  range,
  toArray,
  toAsync,
} from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { callFuncAfterTime, generatorMock } from "../utils";

describe("append", function () {
  describe("sync", function () {
    it("should be contained the contents of the given element", function () {
      expect([...append("c", ["a", "b"])]).toEqual(["a", "b", "c"]);
    });

    it("should be contained the contents of the given element - string", function () {
      expect([...append("c", "ab")]).toEqual(["a", "b", "c"]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(range(1, 4), append(4), append(5), append(6), toArray);
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe("async", function () {
    it("should be contained the contents of the given element", async function () {
      const res = await toArray(append("c", toAsync(["a", "b"])));
      expect(res).toEqual(["a", "b", "c"]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3]),
        (iter) => append(delay(1000, 4), iter),
        toArray,
      );
      expect(res).toEqual([1, 2, 3, 4]);
    });

    it("should be appended sequentially", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 3000);
      let chainedPromise: Promise<void | number> = Promise.resolve();
      const res = await pipe(
        toAsync(range(1, 4)),
        (iter) =>
          append(
            (chainedPromise = chainedPromise.then(() => delay(1000, 4))),
            iter,
          ),
        (iter) =>
          append(
            (chainedPromise = chainedPromise.then(() => delay(1000, 5))),
            iter,
          ),
        (iter) =>
          append(
            (chainedPromise = chainedPromise.then(() => delay(1000, 6))),
            iter,
          ),
        toArray,
      );
      expect(fn).toBeCalled();
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    }, 3050);

    it("should be appended concurrently", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1000);
      const res = await pipe(
        toAsync([1, 2, 3]),
        map((a) => delay(1000, a)),
        append(4),
        append(Promise.resolve(5)),
        append(6),
        concurrent(3),
        toArray,
      );
      expect(fn).toBeCalled();
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    }, 1050);

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = append(1, mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
