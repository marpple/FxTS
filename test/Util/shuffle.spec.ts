import { pipe, shuffle, toArray, toAsync } from "../../src";

describe("shuffle", function () {
  describe("sync", function () {
    it.each([
      [[1, 2, 3, 4], 4],
      ["abcd", 4],
    ])(
      "should return the given elements %s in shuffled order with length %s",
      function (input, expectedLength) {
        const result = shuffle(input);
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
      const result = shuffle([]);
      expect(result).toEqual([]);
    });

    it("should be handle immutable", function () {
      const obj = [1, 2, 3, 4];
      const result = shuffle(obj);
      expect(obj !== result).toEqual(true);
      expect(obj).toEqual([1, 2, 3, 4]);
    });

    it("should handle single element", function () {
      const result = shuffle([42]);
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
        results.push(shuffle(input));
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
        const result = await shuffle(toAsync(input as unknown[]));
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
      const result = await shuffle(toAsync([]));
      expect(result).toEqual([]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe([1, 2, 3, 4, 5, 6], toAsync, shuffle, toArray);
      expect(res).toHaveLength(6);
      expect(res.sort()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should produce different results on multiple calls (statistical test)", async function () {
      const input = [1, 2, 3, 4, 5, 6, 7, 8];
      const results = [];

      // Generate multiple shuffles
      for (let i = 0; i < 20; i++) {
        results.push(await shuffle(toAsync(input)));
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
