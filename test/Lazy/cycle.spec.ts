import {
  concurrent,
  delay,
  map,
  pipe,
  take,
  toArray,
  toAsync,
} from "../../src";
import { Concurrent } from "../../src/Lazy/concurrent";
import cycle from "../../src/Lazy/cycle";
import { callFuncAfterTime, generatorMock } from "../utils";

describe("cycle", function () {
  describe("sync", function () {
    it.each([
      [
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5, 1, 2, 3],
      ],
      ["abcde", ["a", "b", "c", "d", "e", "a", "b", "c"]],
    ])("should repeat given elements %s %s", function (input, result) {
      const iter = cycle(input);

      expect(iter.next().value).toEqual(result[0]);
      expect(iter.next().value).toEqual(result[1]);
      expect(iter.next().value).toEqual(result[2]);
      expect(iter.next().value).toEqual(result[3]);
      expect(iter.next().value).toEqual(result[4]);
      expect(iter.next().value).toEqual(result[0]);
      expect(iter.next().value).toEqual(result[1]);
      expect(iter.next().value).toEqual(result[2]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        cycle([1, 2, 3, 4]),
        map((a) => String(a)),
        take(5),
        toArray,
      );

      expect(res).toEqual(["1", "2", "3", "4", "1"]);
    });
  });

  describe("async", function () {
    it.each([
      [
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5, 1, 2, 3],
      ],
      ["abcde", ["a", "b", "c", "d", "e", "a", "b", "c"]],
    ])("should repeat given elements %s %s", async function (input, result) {
      const iter = cycle(toAsync(input as any));

      expect((await iter.next()).value).toEqual(result[0]);
      expect((await iter.next()).value).toEqual(result[1]);
      expect((await iter.next()).value).toEqual(result[2]);
      expect((await iter.next()).value).toEqual(result[3]);
      expect((await iter.next()).value).toEqual(result[4]);
      expect((await iter.next()).value).toEqual(result[0]);
      expect((await iter.next()).value).toEqual(result[1]);
      expect((await iter.next()).value).toEqual(result[2]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, 4]),
        cycle,
        map((a) => String(a)),
        take(5),
        toArray,
      );

      expect(res).toEqual(["1", "2", "3", "4", "1"]);
    });

    it("should be repeated concurrently", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 900);

      const res = await pipe(
        toAsync(
          (function* () {
            yield delay(300, 1);
            yield delay(300, 2);
            yield delay(300, 3);
            yield delay(300, 4);
            yield delay(300, 5);
            yield delay(300, 6);
          })(),
        ),
        cycle,
        concurrent(2),
        take(6),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    }, 950);

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = cycle(mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
