import { filter, includes, map, pipe, toAsync } from "../src";

describe("includes", function () {
  describe("sync", function () {
    it("should check if the specified value is equal.", function () {
      expect(includes("r", "marpple")).toEqual(true);
      expect(includes("b", "marpple")).toEqual(false);

      expect(includes(1, [1, 2, 3, 4])).toEqual(true);
      expect(includes(5, [1, 2, 3, 4])).toEqual(false);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res1 = pipe(
        [1, 2, 3, 4],
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        includes(14),
      );
      expect(res1).toEqual(true);
    });
  });

  describe("async", function () {
    it("should check if the specified value is equal.", async function () {
      expect(await includes("r", toAsync("marpple"))).toEqual(true);
      expect(await includes("b", toAsync("marpple"))).toEqual(false);

      expect(await includes(1, toAsync([1, 2, 3, 4]))).toEqual(true);
      expect(await includes(5, toAsync([1, 2, 3, 4]))).toEqual(false);
    });
  });

  it("should be able to be used as a curried function in the pipeline", async function () {
    const res1 = await pipe(
      toAsync([1, 2, 3, 4]),
      map((a) => a + 10),
      filter((a) => a % 2 === 0),
      includes(14),
    );
    expect(res1).toEqual(true);
  });
});
