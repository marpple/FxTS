import { isArray } from "../src/index";

describe("isString", function() {
  it.each(
    [2, true, "a"]
  )("given non array then should return false", function(s) {
    const result = isArray(s);
    expect(result).toEqual(false);
  });

  it("given array then should return true", function() {
    const result = isArray([1, 2, 3]);
    expect(result).toEqual(true);
  });
});
