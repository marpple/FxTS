import { dropWhile } from "../../src/index";

describe("drop", function () {
  describe("sync", function () {
    it("should be dropped elements until the value applied to callback returns falsey", function () {
      const acc = [];
      for (const a of dropWhile((a) => a < 3, [1, 2, 3, 4, 5])) {
        acc.push(a);
      }
      expect(acc).toEqual([3, 4, 5]);
    });
  });
});
