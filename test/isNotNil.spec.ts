import { filter, isNotNil, pipe, toArray } from "../src";

describe("isNotNil", function () {
  it.each([2, true, false, 0, "", {}, Symbol("a"), "a"])(
    "given non-nil value then should be true",
    function (a) {
      expect(isNotNil(a)).toBe(true);
    },
  );

  it("given null or undefined then should be false", function () {
    expect(isNotNil(null)).toBe(false);
    expect(isNotNil(undefined)).toBe(false);
  });

  it("should narrow nullable values with filter", function () {
    const result = pipe([1, null, 2, undefined, 3], filter(isNotNil), toArray);
    expect(result).toEqual([1, 2, 3]);
  });
});
