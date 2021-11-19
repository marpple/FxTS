import { isString } from "../src/index";

describe("isString", function () {
  it.each([2, true])("given non string then should return false", function (s) {
    const result = isString(s);
    expect(result).toEqual(false);
  });

  it("given string then should return true", function () {
    const result = isString("a");
    expect(result).toEqual(true);
  });
});
