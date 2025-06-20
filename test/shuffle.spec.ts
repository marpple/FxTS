import { filter, pipe, shuffle, toAsync } from "../src";

describe("shuffle", function () {
  describe("sync", function () {
    it("should shuffle array elements", function () {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);

      // Check all elements are present
      expect(result).toHaveLength(input.length);
      expect(result.sort()).toEqual(input.sort());

      // Check it's a new array
      expect(result).not.toBe(input);
    });

    it("should shuffle string elements", function () {
      const input = "hello";
      const result = shuffle(input);

      // Check all elements are present
      expect(result).toHaveLength(input.length);
      expect(result.sort()).toEqual([...input].sort());
    });

    it("should handle empty array", function () {
      const result = shuffle([]);
      expect(result).toEqual([]);
    });

    it("should handle single element", function () {
      const result = shuffle([42]);
      expect(result).toEqual([42]);
    });

    it("should be able to be used in the pipeline", function () {
      const input = [1, 2, 3, 4, 5, 6];
      const filtered = pipe(
        input,
        filter((a) => a % 2 === 0),
      );
      const res = shuffle(filtered);

      // Check filtered elements are all present
      expect(res.sort()).toEqual([2, 4, 6]);
    });

    it("should produce different results on multiple calls (statistical test)", function () {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = [];

      // Generate multiple shuffles
      for (let i = 0; i < 100; i++) {
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
    it("should shuffle async array elements", async function () {
      const input = [1, 2, 3, 4, 5];
      const result = await shuffle(toAsync(input));

      // Check all elements are present
      expect(result).toHaveLength(input.length);
      expect(result.sort()).toEqual(input.sort());
    });

    it("should shuffle async string elements", async function () {
      const input = "hello";
      const result = await shuffle(toAsync(input));

      // Check all elements are present
      expect(result).toHaveLength(input.length);
      expect(result.sort()).toEqual([...input].sort());
    });

    it("should handle empty async array", async function () {
      const result = await shuffle(toAsync([]));
      expect(result).toEqual([]);
    });

    it("should be able to be used in the pipeline", async function () {
      const input = [1, 2, 3, 4, 5, 6];
      const filtered = pipe(
        input,
        toAsync,
        filter((a) => a % 2 === 0),
      );
      const res = await shuffle(filtered);

      // Check filtered elements are all present
      expect(res.sort()).toEqual([2, 4, 6]);
    });
  });
});
