import { pipe } from "../src/index";

describe("pipe", () => {
  describe("sync", () => {
    it("should return the value evaluated by the composed function", () => {
      const res = pipe(
        0,
        (n) => String(n + 1),
        (n) => Number(n) + 1,
        (n) => String(n + 1),
      );
      expect(res).toEqual("3");
    });
  });
});
