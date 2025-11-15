import { pipe, shuffle, toArray, toAsync } from "../../src";

describe("shuffle", () => {
  describe("sync", () => {
    it.each([
      [[1, 2, 3, 4], 4],
      ["abcd", 4],
    ])(
      "should return the given elements %s in shuffled order with length %s",
      (input, expectedLength) => {
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

    it("should handle empty array", () => {
      const result = shuffle([]);
      expect(result).toEqual([]);
    });

    it("should be handle immutable", () => {
      const obj = [1, 2, 3, 4];
      const result = shuffle(obj);
      expect(obj !== result).toEqual(true);
      expect(obj).toEqual([1, 2, 3, 4]);
    });

    it("should handle single element", () => {
      const result = shuffle([42]);
      expect(result).toEqual([42]);
    });

    it("should be able to be used as a curried function in the pipeline", () => {
      const res = pipe([1, 2, 3, 4, 5, 6], shuffle, toArray);
      expect(res).toHaveLength(6);
      expect(res.sort()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should produce different results on multiple calls (statistical test)", () => {
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

    it("should return consistent results with the same seed", () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const seed = 42;

      const result1 = shuffle(input, seed);
      const result2 = shuffle(input, seed);
      const result3 = shuffle(input, seed);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });

    it("should return different results with different seeds", () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const result1 = shuffle(input, 42);
      const result2 = shuffle(input, 123);
      const result3 = shuffle(input, 999);

      expect(result1).not.toEqual(result2);
      expect(result2).not.toEqual(result3);
      expect(result1).not.toEqual(result3);
    });

    it("should maintain all elements with seeded shuffle", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input, 42);

      expect(result).toHaveLength(5);
      expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it("should work with seed 0", () => {
      const input = [1, 2, 3, 4];
      const result1 = shuffle(input, 0);
      const result2 = shuffle(input, 0);

      expect(result1).toEqual(result2);
    });

    it("should be able to be used with seed in pipeline", () => {
      const input = [1, 2, 3, 4, 5, 6];
      const seed = 42;

      const res1 = pipe(input, (arr) => shuffle(arr, seed), toArray);
      const res2 = pipe(input, (arr) => shuffle(arr, seed), toArray);

      expect(res1).toEqual(res2);
      expect(res1).toHaveLength(6);
      expect(res1.sort()).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe("async", () => {
    it.each([
      [[1, 2, 3, 4], 4],
      ["abcd", 4],
    ])(
      "should return the given elements %s in shuffled order with length %s",
      async (input, expectedLength) => {
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

    it("should handle empty async array", async () => {
      const result = await shuffle(toAsync([]));
      expect(result).toEqual([]);
    });

    it("should be able to be used as a curried function in the pipeline", async () => {
      const res = await pipe([1, 2, 3, 4, 5, 6], toAsync, shuffle, toArray);
      expect(res).toHaveLength(6);
      expect(res.sort()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should produce different results on multiple calls (statistical test)", async () => {
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

    it("should return consistent results with the same seed", async () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const seed = 42;

      const result1 = await shuffle(toAsync(input), seed);
      const result2 = await shuffle(toAsync(input), seed);
      const result3 = await shuffle(toAsync(input), seed);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });

    it("should return different results with different seeds", async () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const result1 = await shuffle(toAsync(input), 42);
      const result2 = await shuffle(toAsync(input), 123);
      const result3 = await shuffle(toAsync(input), 999);

      expect(result1).not.toEqual(result2);
      expect(result2).not.toEqual(result3);
      expect(result1).not.toEqual(result3);
    });

    it("should maintain all elements with seeded shuffle", async () => {
      const input = [1, 2, 3, 4, 5];
      const result = await shuffle(toAsync(input), 42);

      expect(result).toHaveLength(5);
      expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it("should be able to be used with seed in pipeline", async () => {
      const input = [1, 2, 3, 4, 5, 6];
      const seed = 42;

      const res1 = await pipe(
        input,
        toAsync,
        (arr) => shuffle(arr, seed),
        toArray,
      );
      const res2 = await pipe(
        input,
        toAsync,
        (arr) => shuffle(arr, seed),
        toArray,
      );

      expect(res1).toEqual(res2);
      expect(res1).toHaveLength(6);
      expect(res1.sort()).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });
});
