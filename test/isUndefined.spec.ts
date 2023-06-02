import { isUndefined } from "../src";

describe("isUndefined", function () {
  it.each([2, true, null, {}, [], Symbol("a"), "a"])(
    "given non undefined then should be false",
    function (a) {
      const result = isUndefined(a);
      expect(result).toEqual(false);
    },
  );

  it("given undefined then should be true", function () {
    const result = isUndefined(undefined);
    expect(result).toEqual(true);
  });
});
