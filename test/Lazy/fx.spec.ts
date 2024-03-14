import { fx, toAsync } from "../../src";

describe("fx", function () {
  describe("sync", function () {
    it("handle fx iterable", function () {
      const res = fx([1, 2, 3, 4, 5])
        .map((a) => a + 10)
        .toArray();
      expect(res).toEqual([11, 12, 13, 14, 15]);
    });
  });

  describe("async", () => {
    it("handle fx asyncIterable", async function () {
      const res1 = await fx(toAsync([1, 2, 3, 4, 5]))
        .map(async (a) => a + 10)
        .toArray();
      expect(res1).toEqual([11, 12, 13, 14, 15]);

      const res2 = await fx([1, 2, 3, 4, 5])
        .toAsync()
        .map(async (a) => a + 10)
        .toArray();
      expect(res2).toEqual([11, 12, 13, 14, 15]);
    });
  });
});
