import { apply, juxt, pipe, toArray, zip } from "../src";

describe("juxt", function () {
  it("should return an empty array when the list of functions is absent", function () {
    const res = juxt([])();
    expect(res).toEqual([]);
  });

  it("should apply a list of functions to a list of values", function () {
    const res = juxt([Math.min, Math.max])(1, 2, 3, -4, 5, 6, 7);
    expect(res).toEqual([-4, 7]);
  });

  it("should be able to be used as a curried function in the pipeline", function () {
    const entries = (obj: { a: number; b: number }) =>
      pipe(
        [Object.keys, Object.values] as const,
        juxt,
        (f) => f(obj),
        apply(zip),
        toArray,
      );
    const res = entries({ a: 1, b: 2 });
    expect(res).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
  });
});
