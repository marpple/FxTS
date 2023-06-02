import { isString } from "../src";

describe("isString", function () {
  it.each([undefined, null, true, 1, Symbol("a"), () => null])(
    "given non string then should return false",
    function (s) {
      const result = isString(s);
      expect(result).toEqual(false);
    },
  );

  it("given string then should return true", function () {
    const result = isString("a");
    expect(result).toEqual(true);
  });
});
