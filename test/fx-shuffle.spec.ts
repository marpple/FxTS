import { fx, toAsync } from "../src";

describe("fx shuffle method", function () {
  it("should work with fx method chaining for sync", function () {
    const input = [1, 2, 3, 4, 5];
    const result = fx(input).shuffle().toArray();

    expect(result).toHaveLength(input.length);
    expect(result.sort()).toEqual(input.sort());
  });

  it("should work with fx method chaining for async", async function () {
    const input = [1, 2, 3, 4, 5];
    const result = await fx(toAsync(input)).shuffle().toArray();

    expect(result).toHaveLength(input.length);
    expect(result.sort()).toEqual(input.sort());
  });

  it("should produce different results", function () {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = [];

    for (let i = 0; i < 20; i++) {
      results.push(fx(input).shuffle().toArray());
    }

    // Check that not all results are identical
    const firstResult = JSON.stringify(results[0]);
    const allIdentical = results.every(
      (result) => JSON.stringify(result) === firstResult,
    );
    expect(allIdentical).toBe(false);
  });
});
