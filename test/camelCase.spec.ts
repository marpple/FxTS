import { camelCase } from "../src";

describe("camelCase", function () {
  it("should convert various delimiters to camel case", function () {
    expect(camelCase("foo bar")).toBe("fooBar");
    expect(camelCase("foo-bar")).toBe("fooBar");
    expect(camelCase("foo_bar")).toBe("fooBar");
    expect(camelCase("Foo Bar")).toBe("fooBar");
  });

  it("should handle existing camel/pascal case and acronyms", function () {
    expect(camelCase("fooBar")).toBe("fooBar");
    expect(camelCase("FooBar")).toBe("fooBar");
    expect(camelCase("XMLHttpRequest")).toBe("xmlHttpRequest");
  });

  it("should split digit runs into words", function () {
    expect(camelCase("foo2bar")).toBe("foo2Bar");
  });

  it("should return an empty string as-is", function () {
    expect(camelCase("")).toBe("");
  });
});
