import { zipObject } from "../src";

describe("zipObject", function () {
  it("should pair keys with values position by position", function () {
    expect(zipObject(["a", "b"], [1, 2])).toEqual({ a: 1, b: 2 });
  });

  it("should assign undefined to keys without a matching value", function () {
    const res = zipObject(["a", "b", "c"], [1, 2]);
    expect(res).toEqual({ a: 1, b: 2, c: undefined });
    expect("c" in res).toBe(true);
  });

  it("should ignore extra values", function () {
    expect(zipObject(["a", "b"], [1, 2, 3])).toEqual({ a: 1, b: 2 });
  });

  it("should accept any sync iterables", function () {
    expect(zipObject(new Set(["a", "b"]), new Set([1, 2]))).toEqual({
      a: 1,
      b: 2,
    });
  });

  it("should return an empty object for empty keys", function () {
    expect(zipObject([], [1, 2])).toEqual({});
  });
});
