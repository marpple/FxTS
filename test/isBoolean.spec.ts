import { isBoolean } from "../src";

describe("isBoolean", function () {
  it.each([undefined, null, 1, "1", Symbol("a"), () => null])(
    "given non boolean then should return false",
    function (s) {
      const result = isBoolean(s);
      expect(result).toEqual(false);
    },
  );

  it("given boolean then should return true", function () {
    const result = isBoolean(true);
    expect(result).toEqual(true);
  });
});
