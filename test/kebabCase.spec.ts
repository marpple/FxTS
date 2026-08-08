import { kebabCase } from "../src";

describe("kebabCase", function () {
  it("should convert various inputs to kebab case", function () {
    expect(kebabCase("foo bar")).toBe("foo-bar");
    expect(kebabCase("fooBar")).toBe("foo-bar");
    expect(kebabCase("foo_bar")).toBe("foo-bar");
    expect(kebabCase("Foo Bar")).toBe("foo-bar");
  });

  it("should handle acronyms and digits", function () {
    expect(kebabCase("XMLHttpRequest")).toBe("xml-http-request");
    expect(kebabCase("foo2bar")).toBe("foo-2-bar");
  });

  it("should return an empty string as-is", function () {
    expect(kebabCase("")).toBe("");
  });
});
