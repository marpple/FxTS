import { isString, negate, throwIfNot } from "../src";

describe("throwIfNot", function () {
  it("if return of predicate is false", function () {
    const input = "input is string";
    const predicate = isString;
    const test = throwIfNot(predicate);
    expect(test(input)).toBe("input is string");
  });

  it("if return of predicate is true", function () {
    const input = "input is string";
    const predicate = negate(isString);
    const test = throwIfNot(predicate);
    expect(() => test(input)).toThrowError("input is string");
  });
});
