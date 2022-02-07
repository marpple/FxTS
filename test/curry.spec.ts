import { curry, filter, map, pipe, toArray } from "../src";

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

  it("curried function should be able to be used within the pipeline.", function () {
    const add = curry((a: number, b: number, c: number) => a + b + c);
    const multiply = curry((a: number, b: number) => a * b);
    const lt = curry((l: number, r: number) => l < r);

    expect(pipe(1, add(2, 3), multiply(10))).toBe(60);
    expect(
      pipe(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        map(add(2, 3)),
        map(multiply(10)),
        filter(lt(100)),
        toArray,
      ),
    ).toEqual([110, 120, 130, 140, 150]);
  });
});
