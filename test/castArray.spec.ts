import { castArray } from "../src";

describe("castArray", function () {
  it("should wrap a primitive value in an array", function () {
    expect(castArray(1)).toEqual([1]);
    expect(castArray("a")).toEqual(["a"]);
    expect(castArray(false)).toEqual([false]);
  });

  it("should return the same array reference", function () {
    const arr = [1, 2, 3];
    expect(castArray(arr)).toBe(arr);

    const empty: number[] = [];
    expect(castArray(empty)).toBe(empty);
  });

  it("should wrap null and undefined", function () {
    expect(castArray(null)).toEqual([null]);
    expect(castArray(undefined)).toEqual([undefined]);
  });

  it("should wrap an object", function () {
    const obj = { a: 1 };
    const result = castArray(obj);
    expect(result).toEqual([{ a: 1 }]);
    expect(result[0]).toBe(obj);
  });
});
