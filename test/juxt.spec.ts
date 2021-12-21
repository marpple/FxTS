import { juxt } from "../src";

describe("juxt", function () {
  it("should return an empty array when the list of functions is absent", function () {
    const res = juxt([])();
    expect(res).toEqual([]);
  });

  it("should apply a list of functions to a list of values", function () {
    const res = juxt([Math.min, Math.max])(1, 2, 3, -4, 5, 6, 7);
    expect(res).toEqual([-4, 7]);
  });
});
