import { apply, pipe, range, toArray } from "../src";

describe("apply", function () {
  it("should apply given list to the function", function () {
    const res = apply(Math.max, [1, 2, 3, 4, 5]);
    expect(res).toEqual(5);
  });

  it("should be able to be used as a curried function in the pipeline", function () {
    const res = pipe(range(1, 6), toArray, apply(Math.max));
    expect(res).toEqual(5);
  });
});
