import { compactObject } from "../src";

describe("compactObject", function () {
  it("should return identity object if there is no null or undefined property", function () {
    const obj = { a: 1, b: "b" };
    expect(compactObject(obj)).toEqual(obj);
  });

  it("should return an object with properties that are null or undefined removed", function () {
    const obj = { a: 1, b: "b", c: undefined, d: null };
    expect(compactObject(obj)).toEqual({ a: 1, b: "b" });
  });

  it("should not removed any falsy values other than null or undefined", function () {
    const obj = { a: 0, b: "", c: undefined, d: null, e: false };
    expect(compactObject(obj)).toEqual({ a: 0, b: "", e: false });
  });
});
