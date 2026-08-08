import { isPlainObject } from "../src";

describe("isPlainObject", function () {
  it("should return true for object literals", function () {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject(new Object())).toBe(true);
  });

  it("should return true for objects with a null prototype", function () {
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it("should return false for arrays", function () {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
  });

  it("should return false for functions", function () {
    expect(isPlainObject(() => undefined)).toBe(false);
    expect(
      isPlainObject(function () {
        return undefined;
      }),
    ).toBe(false);
  });

  it("should return false for built-in objects", function () {
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new Map())).toBe(false);
    expect(isPlainObject(new Set())).toBe(false);
    expect(isPlainObject(/abc/)).toBe(false);
  });

  it("should return false for class instances", function () {
    class Foo {
      a = 1;
    }
    expect(isPlainObject(new Foo())).toBe(false);
    expect(isPlainObject(Object.create({}))).toBe(false);
  });

  it("should return false for null and undefined", function () {
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
  });

  it("should return false for primitives", function () {
    expect(isPlainObject(1)).toBe(false);
    expect(isPlainObject("a")).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(Symbol("a"))).toBe(false);
  });
});
