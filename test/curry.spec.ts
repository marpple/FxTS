import { curry } from "../src";

describe("curry", function () {
  it("should not change a unary function", function () {
    const unary = (a: string) => a + "bar";
    const curried = curry(unary);
    expect(curried("foo")).toBe("foobar");
  });

  it("given function should be curried", function () {
    const add = (a: number, b: number, c: number) => a + b + c;
    const curried = curry(add);
    expect(curried(1)(2)(3)).toBe(6);
    expect(curried(1, 2)(3)).toBe(6);
    expect(curried(1)(2, 3)).toBe(6);
    expect(curried(1, 2, 3)).toBe(6);
    expect(curried()(1, 2, 3)).toBe(6);
    expect(curried(1)()(2, 3)).toBe(6);
  });
});
