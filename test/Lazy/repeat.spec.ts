import { pipe, toArray } from "../../src";
import repeat from "../../src/Lazy/repeat";

describe("repeat", function () {
  it.each([
    [5, 4, [4, 4, 4, 4, 4]],
    [4, "a", ["a", "a", "a", "a"]],
    [2, Promise.resolve("a"), [Promise.resolve("a"), Promise.resolve("a")]],
  ])(
    "should repeat returning specified value %i %s",
    function (n, value, result) {
      expect(toArray(repeat(n, value))).toEqual(result);
    },
  );

  it("should be able to be used as a curried function in the pipeline", function () {
    const res = pipe(5, repeat(4), toArray);
    expect(res).toEqual([5, 5, 5, 5]);
  });
});
