import { isFunction } from "../src";

describe("isFunction", function () {
  it("should return true for functions", function () {
    expect(isFunction(() => 1)).toBe(true);
    expect(
      isFunction(function () {
        return 1;
      }),
    ).toBe(true);
    expect(isFunction(async () => 1)).toBe(true);
    expect(
      isFunction(function* () {
        yield 1;
      }),
    ).toBe(true);
    expect(isFunction(class A {})).toBe(true);
    expect(isFunction(Math.max)).toBe(true);
  });

  it("should return false for non-functions", function () {
    expect(isFunction(1)).toBe(false);
    expect(isFunction("function")).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
  });
});
