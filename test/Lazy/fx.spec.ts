import { fx, toArray, toAsync } from "../../src";

describe("fx", function () {
  describe("sync", function () {
    it("handle fx iterable (default)", function () {
      const res1 = [...fx([1, 2, 3, 4, 5])];
      expect(res1).toEqual([1, 2, 3, 4, 5]);

      const res2 = [...fx("abc")];
      expect(res2).toEqual(["a", "b", "c"]);
    });

    it("handle fx iterable", function () {
      const res = fx([1, 2, 3, 4, 5])
        .map((a) => a + 10)
        .toArray();
      expect(res).toEqual([11, 12, 13, 14, 15]);
    });
  });

  describe("async", () => {
    it("handle fx asyncIterable (default)", async function () {
      const res1 = await toArray(fx(toAsync([1, 2, 3, 4, 5])));
      expect(res1).toEqual([1, 2, 3, 4, 5]);

      const res2 = await toArray(fx(toAsync("abc")));
      expect(res2).toEqual(["a", "b", "c"]);
    });

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
