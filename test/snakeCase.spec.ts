import { snakeCase } from "../src";

describe("snakeCase", function () {
  it("should convert various inputs to snake case", function () {
    expect(snakeCase("foo bar")).toBe("foo_bar");
    expect(snakeCase("fooBar")).toBe("foo_bar");
    expect(snakeCase("foo-bar")).toBe("foo_bar");
    expect(snakeCase("Foo Bar")).toBe("foo_bar");
  });

  it("should handle acronyms and digits", function () {
    expect(snakeCase("XMLHttpRequest")).toBe("xml_http_request");
    expect(snakeCase("foo2bar")).toBe("foo_2_bar");
  });

  it("should return an empty string as-is", function () {
    expect(snakeCase("")).toBe("");
  });
});
