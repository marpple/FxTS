import { capitalize } from "../src";

describe("capitalize", function () {
  it("should upper-case the first character and lower-case the rest", function () {
    expect(capitalize("fred")).toBe("Fred");
    expect(capitalize("FRED")).toBe("Fred");
    expect(capitalize("fooBar")).toBe("Foobar");
  });

  it("should return an empty string as-is", function () {
    expect(capitalize("")).toBe("");
  });
});
