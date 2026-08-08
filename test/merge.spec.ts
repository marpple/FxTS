import { merge, pipe } from "../src";

describe("merge", function () {
  it("should merge nested plain objects recursively with source winning", function () {
    expect(merge({ a: 1, b: { c: 2, d: 3 } }, { b: { d: 9, e: 4 } })).toEqual({
      a: 1,
      b: { c: 2, d: 9, e: 4 },
    });
  });

  it("should merge arrays index by index", function () {
    expect(merge({ a: [1, 2, 3] }, { a: [9] })).toEqual({ a: [9, 2, 3] });
    expect(merge({ a: [1] }, { a: [9, 8, 7] })).toEqual({ a: [9, 8, 7] });
    expect(merge({ a: [{ x: 1, y: 2 }] }, { a: [{ y: 9 }] })).toEqual({
      a: [{ x: 1, y: 9 }],
    });
  });

  it("should not modify target or source", function () {
    const target = { a: { b: 1 }, arr: [1, 2] };
    const source = { a: { c: 2 }, arr: [9] };
    merge(target, source);
    expect(target).toEqual({ a: { b: 1 }, arr: [1, 2] });
    expect(source).toEqual({ a: { c: 2 }, arr: [9] });
  });

  it("should not share references with inputs for plain containers", function () {
    const target = { a: { b: 1 } };
    const source = { c: { d: 2 }, arr: [{ e: 3 }] };
    const result = merge(target, source);
    expect(result.a).not.toBe(target.a);
    expect(result.c).not.toBe(source.c);
    expect(result.arr[0]).not.toBe(source.arr[0]);
    expect(result).toEqual({ a: { b: 1 }, c: { d: 2 }, arr: [{ e: 3 }] });
  });

  it("should keep non-plain values by reference", function () {
    const date = new Date(0);
    const map = new Map([["a", 1]]);
    const result = merge({}, { date, map });
    expect(result.date).toBe(date);
    expect(result.map).toBe(map);
  });

  it("should not overwrite existing values with undefined", function () {
    expect(merge({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
    expect(merge({ a: [1, 2] }, { a: [undefined, 9] })).toEqual({ a: [1, 9] });
  });

  it("should create keys that only exist in source even when undefined", function () {
    const result = merge({ a: 1 }, { b: undefined });
    expect("b" in result).toBe(true);
    expect(result.b).toBe(undefined);
  });

  it("should replace when container kinds differ", function () {
    expect(merge({ a: [1, 2] }, { a: { x: 1 } })).toEqual({ a: { x: 1 } });
    expect(merge({ a: { x: 1 } }, { a: [1, 2] })).toEqual({ a: [1, 2] });
    expect(merge({ a: { x: 1 } }, { a: 3 })).toEqual({ a: 3 });
  });

  it("should not pollute the prototype chain", function () {
    const evil = JSON.parse(
      '{"__proto__": {"polluted": true}, "a": 1}',
    ) as object;
    const result = merge({}, evil) as Record<string, unknown>;
    expect(result.a).toBe(1);
    expect(({} as Record<string, unknown>).polluted).toBe(undefined);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });

  it("should preserve the target's key order", function () {
    expect(Object.keys(merge({ b: 2, a: 1 }, { b: 9, c: 3 }))).toEqual([
      "b",
      "a",
      "c",
    ]);
  });

  it("should be able to be used as a curried function in the pipeline", function () {
    const result = pipe({ port: 3000 }, merge({ host: "localhost", port: 80 }));
    expect(result).toEqual({ host: "localhost", port: 3000 });
  });
});
