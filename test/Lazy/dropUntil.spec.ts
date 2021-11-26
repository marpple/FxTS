import { dropUntil } from "../../src";

describe("dropUntil", function () {
  describe("sync", function () {
    it("should be dropped elements until the value applied to callback returns truly", function () {
      const arr = [1, 2, 3, 4, 5, 1, 2];
      const acc = [];
      for (const a of dropUntil((a) => a > 3, arr)) {
        acc.push(a);
      }
      expect(acc).toEqual([5, 1, 2]);
    });
  });
});
