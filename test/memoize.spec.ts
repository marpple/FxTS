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

  it("should be supported WeakMap `cache`", () => {
    let callCount = 0;
    function printHelloworld(obj: { key: string }): string {
      callCount++;
      return obj.key + " world";
    }

    const memoized = memoize(printHelloworld);
    memoized.cache = new WeakMap();

    const obj = { key: "hello" };
    const res1 = memoized(obj);
    expect(res1).toEqual("hello world");
    const res2 = memoized(obj);
    expect(res2).toEqual("hello world");
    expect(callCount).toEqual(1);
  });
});
