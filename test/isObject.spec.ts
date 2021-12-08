import { isObject } from "../src";

describe("isObject", function () {
  it.each([
    [[], true],
    [{}, true],
    [() => "", true],
    [Promise.resolve(), true],
    [class A {}, true],
    [new (class A {})(), true],
    [123, false],
    ["abc", false],
    [Symbol("symbol"), false],
    [null, false],
    [undefined, false],
  ])(
    "should return a boolean value that given value is object or not",
    function (value, expected) {
      expect(isObject(value)).toEqual(expected);
    },
  );
});
