import {
  chunk,
  concurrent,
  delay,
  filter,
  map,
  pipe,
  range,
  toArray,
  toAsync,
} from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { callFuncAfterTime, generatorMock } from "../utils";

const expected = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11],
];

describe("chunk", function () {
  describe("sync", function () {
    it("should be chunked by the given number - number", function () {
      const res = toArray(chunk(3, range(1, 12)));
      expect(toArray(chunk(0, range(1, 12)))).toEqual([]);
      expect(res).toEqual(expected);
    });

    it("should be chunked by the given number - string", function () {
      const res = toArray(chunk(3, "abcdefghijklmnopqrstuvwxyz"));
      expect(res).toEqual([
        ["a", "b", "c"],
        ["d", "e", "f"],
        ["g", "h", "i"],
        ["j", "k", "l"],
        ["m", "n", "o"],
        ["p", "q", "r"],
        ["s", "t", "u"],
        ["v", "w", "x"],
        ["y", "z"],
      ]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(range(1, 12), chunk(3), toArray);
      expect(res).toEqual(expected);
    });
  });

  describe("async", function () {
    it("should be chunked by the given number - number (empty)", async function () {
      const res = await toArray(chunk(0, toAsync(range(1, 12))));
      expect(res).toEqual([]);
    });

    it("should be chunked by the given number - number", async function () {
      const res = await toArray(chunk(3, toAsync(range(1, 12))));
      expect(res).toEqual(expected);
    });

    it("should be chunked after concurrent", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 600);
      const res = await pipe(
        toAsync(range(1, 12)),
        map((a) => delay(100, a)),
        concurrent(2),
        chunk(3),
        toArray,
      );
      expect(fn).toBeCalled();
      expect(res).toEqual(expected);
    }, 650);

    it("should be chunked after concurrent with filter", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1000);
      const res = await pipe(
        toAsync(range(1, 21)),
        map((a) => delay(100, a)),
        filter((a) => a % 2 === 0),
        concurrent(2),
        chunk(3),
        toArray,
      );
      const expected: number[][] = [[2, 4, 6], [8, 10, 12], [14, 16, 18], [20]];
      expect(fn).toBeCalled();
      expect(res).toEqual(expected);
    }, 1050);

    it("should be chunked before concurrent", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1000);
      const res = await pipe(
        toAsync(range(1, 21)),
        map((a) => delay(100, a)),
        filter((a) => a % 2 === 0),
        chunk(3),
        concurrent(2),
        toArray,
      );
      const expected: number[][] = [[2, 4, 6], [8, 10, 12], [14, 16, 18], [20]];
      expect(fn).toBeCalled();
      expect(res).toEqual(expected);
    }, 1050);

    it("should be able to handle an error when the callback is asynchronous", async function () {
      await expect(
        pipe(
          toAsync(range(1, 21)),
          map((a) => delay(100, a)),
          filter((a) =>
            a % 2 === 0 ? Promise.reject(new Error("err")) : true,
          ),
          chunk(3),
          concurrent(2),
          toArray,
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to handle an error when working concurrent", async function () {
      await expect(
        pipe(
          toAsync(range(1, 21)),
          map((a) => delay(100, a)),
          filter((a) => a % 2 === 0),
          chunk(3),
          map(() => {
            throw new Error("err");
          }),
          concurrent(2),
          toArray,
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(range(1, 12), toAsync, chunk(3), toArray);
      expect(res).toEqual(expected);
    });

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = chunk(3, mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
