import {
  chunk,
  concurrent,
  delay,
  flat,
  map,
  pipe,
  range,
  toArray,
  toAsync,
} from "../../src/index";
import { callFuncAfterTime } from "../utils";

describe("flat", function () {
  describe("sync", function () {
    it("should be flattened", function () {
      const acc = [];
      for (const a of flat([[1, 2], 3, 4, 5, [6, 7]])) {
        acc.push(a);
      }
      expect(acc).toEqual([1, 2, 3, 4, 5, 6, 7]);

      const res = [...flat([[1, 2], 3, 4, 5, [6, 7, [8, 9]]], 2)];
      expect(res).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, [4, 5]],
        flat,
        map((a) => a + 10),
        toArray,
      );

      expect(res).toEqual([11, 12, 13, 14, 15]);
    });
  });

  describe("async", function () {
    it("should be flattened", async function () {
      const acc = [];
      for await (const a of flat(toAsync([[1, 2], 3, 4, 5, [6, 7]]))) {
        acc.push(a);
      }
      expect(acc).toEqual([1, 2, 3, 4, 5, 6, 7]);

      const res = await toArray(
        flat(toAsync([[1, 2], 3, 4, 5, [6, 7, [8, 9]]]), 2),
      );
      expect(res).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, [4, 5]]),
        flat,
        map((a) => a + 10),
        toArray,
      );

      expect(res).toEqual([11, 12, 13, 14, 15]);
    });

    it("should be flattened concurrently", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 2000);
      const iterator = toAsync([
        [1],
        [2],
        [3, 4],

        [5, 6],
        [7, 8, 9, 10],
        [11, 12],

        [13],
        [14],
      ]);

      const res = pipe(
        iterator,
        map((a) => delay(1000, a)),
        flat,
        concurrent(3),
      );

      const { value: v1 } = await res.next();
      const { value: v2 } = await res.next();
      const { value: v3 } = await res.next();
      const { value: v4 } = await res.next();
      const { value: v5 } = await res.next();
      const { value: v6 } = await res.next();
      expect(fn).toBeCalled();
      expect(v1).toEqual(1);
      expect(v2).toEqual(2);
      expect(v3).toEqual(3);
      expect(v4).toEqual(4);
      expect(v5).toEqual(5);
      expect(v6).toEqual(6);

      const { value: v7 } = await iterator.next();
      expect(v7).toEqual([13]);
    }, 2050);

    type FlatTest = {
      input: Array<any>;
      depth: number;
      size: number;
      timeout: number;
      expected: Array<any>;
    };

    const testParameters: FlatTest[] = [
      {
        input: [
          [1, 2],
          [3, 4],
          [5, 6],
          [7, 8],
        ],
        depth: 1,
        size: 1,
        timeout: 2000,
        expected: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      {
        input: [
          [1, 2],
          [3, 4],
          [5, 6],
          [7, 8],
        ],
        depth: 1,
        size: 3,
        timeout: 2000,
        expected: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      {
        input: [
          [1, 2],
          [3, 4],
          [5, 6],
          [7, 8],
        ],
        depth: 1,
        size: 4,
        timeout: 1000,
        expected: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      {
        input: [
          [1, [2]],
          [3, [4]],
          [5, [6]],
          [7, [8]],
        ],
        depth: 1,
        size: 4,
        timeout: 1000,
        expected: [1, [2], 3, [4], 5, [6], 7, [8]],
      },
      {
        input: [
          [1, [2]],
          [3, [4]],
          [5, [6]],
          [7, [8]],
        ],
        depth: 2,
        size: 4,
        timeout: 1000,
        expected: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      {
        input: [
          [1], //
          [2, 3],
          [4],
          [5, 6],
          [7],
          [8, 9],
        ],
        depth: 1,
        size: 2,
        timeout: 3000,
        expected: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
      {
        input: [
          [1], //
          [2, 3],
          [4],
          [5, 6],
          [7],
          [8, 9],
          [10],
        ],
        depth: 1,
        size: 2,
        timeout: 4000,
        expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {
        input: [
          [1], //
          [2, 3],
          [4],
          [5, 6],
          [7],
          [8, 9],
        ],
        depth: 1,
        size: 3,
        timeout: 2000,
        expected: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
      {
        input: [
          [1], //
          [2, 3, 4],
          [5, 6],
          [7, 8, 9, 10],
          [11, 12],
        ],
        depth: 1,
        size: 3,
        timeout: 2000,
        expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
      {
        input: [
          [1], //
          [2, 3, 4],
          [5, 6],
          [7, 8, 9, 10],
          [11, 12],
        ],
        depth: 1,
        size: 3,
        timeout: 2000,
        expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
      {
        input: [
          [1], //
          [[[2]], 3, 4],
          [5, [[[6]]]],
          [7, 8, 9, 10],
          [11, 12],
        ],
        depth: 2,
        size: 3,
        timeout: 2000,
        expected: [1, [2], 3, 4, 5, [[6]], 7, 8, 9, 10, 11, 12],
      },
      {
        input: [
          [1], //
          [[[2]], 3, [[[[4]]]]],
          [5, [[[6]]]],
          [7, 8, 9, 10],
          [11, 12],
        ],
        depth: 2,
        size: 5,
        timeout: 1000,
        expected: [1, [2], 3, [[[4]]], 5, [[6]], 7, 8, 9, 10, 11, 12],
      },
    ];

    it.each(testParameters)(
      `should be flattened concurrently`,
      async ({ timeout, input, depth, size, expected }: FlatTest) => {
        const fn = jest.fn();
        jest.setTimeout(timeout + 100);
        callFuncAfterTime(fn, timeout);

        const res = await pipe(
          toAsync(input),
          map((a) => delay(1000, a)),
          (a) => flat(a, depth),
          concurrent(size),
          toArray,
        );

        expect(fn).toBeCalled();
        expect(res).toEqual(expected);
      },
    );

    it("should be flattened concurrently with chuck", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 2000);

      const res = await pipe(
        toAsync(range(1, 7)),
        map((a) => delay(1000, a)),
        chunk(2),
        flat,
        concurrent(3),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    }, 2050);

    it("should be able to handle an error", async function () {
      await expect(
        pipe(
          toAsync(
            (function* () {
              yield [1, 2, 3];
              throw new Error("err");
            })(),
          ),
          map((a) => delay(1000, a)),
          flat,
          concurrent(2),
          toArray,
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to handle errors", async function () {
      await expect(
        pipe(
          toAsync(
            (function* () {
              yield [1, 2, 3];
              yield [1, 2, 3];
              yield [1, 2, 3];
              yield [1, 2, 3];
            })(),
          ),
          map(async (a) => {
            await delay(1000, a);
            throw new Error("err");
          }),
          flat,
          concurrent(4),
          toArray,
        ),
      ).rejects.toThrow("err");
    });
  });
});
