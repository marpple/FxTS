import { isDate } from "../src";

describe("isDate", function () {
  it.each([
    undefined,
    null,
    true,
    1,
    "2024-01-01",
    Symbol("a"),
    () => null,
    {},
    new Map(),
  ])("given non Date then should return false", function (value) {
    const result = isDate(value);
    expect(result).toEqual(false);
  });

  it("given Date then should return true", function () {
    const date = new Date();
    const result = isDate(date);
    expect(result).toEqual(true);
  });

  it("given invalid Date then should return true", function () {
    const invalidDate = new Date("invalid");
    const result = isDate(invalidDate);
    expect(result).toEqual(true);
  });
});
