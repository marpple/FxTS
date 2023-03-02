import { memoize } from "../src";

describe("memoize", function () {
  it("should be memoized results base on the first argument given", () => {
    function addABC(a: number, b: number, c: number) {
      return a + b + c;
    }

    const memoized = memoize(addABC);

    expect(memoized(10, 20, 30)).toEqual(60);
    expect(memoized(10, 20, 40)).toEqual(60);
    expect(memoized(0, 20, 50)).toEqual(70);
  });

  it("should be supported using `resolver`", () => {
    function addABC(a: number, b: number, c: number) {
      return a + b + c;
    }

    const memoized = memoize(addABC, addABC);

    expect(memoized(10, 20, 30)).toEqual(60);
    expect(memoized(10, 20, 40)).toEqual(70);
  });
});
