import { isString, throwIf } from "../src";

describe("throwIf", function () {
  it("if return of predicate is true", function () {
    const input = "input is string";
    const predicate = isString;
    const test = throwIf(predicate);
    expect(() => test(input)).toThrowError("input is string");
  });

  it("if return of predicate is false", function () {
    const input = 10;
    const predicate = isString;
    const test = throwIf(predicate);
    expect(test(input)).toBe(10);
  });
});
