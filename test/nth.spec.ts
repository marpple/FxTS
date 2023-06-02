import { filter, map, nth, pipe, toAsync } from "../src";

describe("nth", function () {
  describe("sync", function () {
    it("should return nth element", function () {
      expect(nth(2, "marpple")).toEqual("r");
      expect(nth(10, "marpple")).toEqual(undefined);
      expect(() => nth(-1, "marpple")).toThrow();

      expect(nth(1, [1, 2, 3, 4])).toEqual(2);
      expect(nth(5, [1, 2, 3, 4])).toEqual(undefined);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, 4],
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        nth(1),
      );
      expect(res).toEqual(14);
    });
  });

  describe("async", function () {
    it("should return nth element", async function () {
      expect(await nth(2, toAsync("marpple"))).toEqual("r");
      expect(await nth(10, toAsync("marpple"))).toEqual(undefined);

      expect(await nth(1, toAsync([1, 2, 3, 4]))).toEqual(2);
      expect(await nth(5, toAsync([1, 2, 3, 4]))).toEqual(undefined);
    });
  });

  it("should be able to be used as a curried function in the pipeline", async function () {
    const res1 = await pipe(
      toAsync([1, 2, 3, 4]),
      map((a) => a + 10),
      filter((a) => a % 2 === 0),
      nth(1),
    );
    expect(res1).toEqual(14);
  });
});
