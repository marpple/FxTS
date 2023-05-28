import { isArray } from "../src";

describe("isArray", function () {
  it.each([undefined, null, true, 1, "a", Symbol("a"), () => null])(
    "given non array then should return false",
    function (s) {
      const result = isArray(s);
      expect(result).toEqual(false);
    },
  );

  it("given array then should return true", function () {
    const result = isArray([1, 2, 3]);
    expect(result).toEqual(true);
  });
});
