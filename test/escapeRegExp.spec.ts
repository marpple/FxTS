import { escapeRegExp } from "../src";

describe("escapeRegExp", function () {
  it("should escape all RegExp special characters", function () {
    expect(escapeRegExp("^$\\.*+?()[]{}|")).toBe(
      "\\^\\$\\\\\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|",
    );
  });

  it("should return strings without special characters as-is", function () {
    expect(escapeRegExp("abc 123 한글")).toBe("abc 123 한글");
    expect(escapeRegExp("")).toBe("");
  });

  it("should not escape '-' and '/'", function () {
    expect(escapeRegExp("a-b/c")).toBe("a-b/c");
  });

  it("should produce a pattern that matches the input literally", function () {
    const input = "[fxts](https://fxts.dev/) costs $1.00?";
    const re = new RegExp(escapeRegExp(input));
    expect(re.test(input)).toBe(true);
    expect(re.test("fxts costs 1 00")).toBe(false);
  });
});
