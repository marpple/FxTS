import { isNumber } from "../src";

describe("isNumber", function () {
  it.each([undefined, null, true, "1", Symbol("a"), () => null])(
    "given non number then should return false",
    function (s) {
      const result = isNumber(s);
      expect(result).toEqual(false);
    },
  );

  it("given number then should return true", function () {
    const result = isNumber(2);
    expect(result).toEqual(true);
  });
});
