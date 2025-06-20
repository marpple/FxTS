import { delay, filter, map, pipe, toArray, toAsync } from "../../src";
import shuffle from "../../src/Lazy/shuffle";
import concurrent, { Concurrent } from "../../src/Lazy/concurrent";
import { generatorMock } from "../utils";

describe("shuffle", function () {
  describe("sync", function () {
    it.each([
      [[1, 2, 3, 4], 4],
      ["abcd", 4],
    ])(
      "should return the given elements %s in shuffled order with length %s",
      function (input, expectedLength) {
        const result = toArray(shuffle(input));
        expect(result).toHaveLength(expectedLength);

        // Check all elements are present
        if (Array.isArray(input)) {
          expect(result.sort()).toEqual(input.sort());
        } else {
          expect(result.sort()).toEqual([...input].sort());
        }
      },
    );

    it("should handle empty array", function () {
      const result = toArray(shuffle([]));
      expect(result).toEqual([]);
    });

    it("should handle single element", function () {
      const result = toArray(shuffle([42]));
      expect(result).toEqual([42]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe([1, 2, 3, 4, 5, 6], shuffle, toArray);
      expect(res).toHaveLength(6);
      expect(res.sort()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should produce different results on multiple calls (statistical test)", function () {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = [];

      // Generate multiple shuffles
      for (let i = 0; i < 50; i++) {
        results.push(toArray(shuffle(input)));
      }

      // Check that not all results are identical (very unlikely with proper shuffling)
      const firstResult = JSON.stringify(results[0]);
      const allIdentical = results.every(
        (result) => JSON.stringify(result) === firstResult,
      );
      expect(allIdentical).toBe(false);
    });
  });

  describe("async", function () {
    it.each([
      [[1, 2, 3, 4], 4],
      ["abcd", 4],
    ])(
      "should return the given elements %s in shuffled order with length %s",
      async function (input, expectedLength) {
        const result = await toArray(shuffle(toAsync(input as any)));
        expect(result).toHaveLength(expectedLength);

        // Check all elements are present
        if (Array.isArray(input)) {
          expect(result.sort()).toEqual(input.sort());
        } else {
          expect(result.sort()).toEqual([...input].sort());
        }
      },
    );

    it("should handle empty async array", async function () {
      const result = await toArray(shuffle(toAsync([])));
      expect(result).toEqual([]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe([1, 2, 3, 4, 5, 6], toAsync, shuffle, toArray);
      expect(res).toHaveLength(6);
      expect(res.sort()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should be shuffled elements concurrently", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
        map((a) => delay(50, a)),
        filter((a) => a % 2 === 0),
        shuffle,
        concurrent(3),
        toArray,
      );
      expect(res).toHaveLength(5);
      expect(res.sort((a, b) => a - b)).toEqual([2, 4, 6, 8, 10]);
    }, 450);

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = shuffle(mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });

    it("should produce different results on multiple calls (statistical test)", async function () {
      const input = [1, 2, 3, 4, 5, 6, 7, 8];
      const results = [];

      // Generate multiple shuffles
      for (let i = 0; i < 20; i++) {
        results.push(await toArray(shuffle(toAsync(input))));
      }

      // Check that not all results are identical (very unlikely with proper shuffling)
      const firstResult = JSON.stringify(results[0]);
      const allIdentical = results.every(
        (result) => JSON.stringify(result) === firstResult,
      );
      expect(allIdentical).toBe(false);
    });
  });
});
