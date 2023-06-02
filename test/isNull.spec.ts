import { isNull } from "../src";

describe("isNull", function () {
  it.each([2, true, undefined, {}, [], Symbol("a"), "a"])(
    "given non null then should be false",
    function (a) {
      const result = isNull(a);
      expect(result).toEqual(false);
    },
  );

  it("given null then should be true", function () {
    const result = isNull(null);
    expect(result).toEqual(true);
  });
});
