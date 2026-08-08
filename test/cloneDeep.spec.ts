import { cloneDeep } from "../src";

describe("cloneDeep", function () {
  it("should return primitives and functions as-is", function () {
    expect(cloneDeep(1)).toBe(1);
    expect(cloneDeep("a")).toBe("a");
    expect(cloneDeep(null)).toBe(null);
    expect(cloneDeep(undefined)).toBe(undefined);
    const fn = () => 1;
    expect(cloneDeep(fn)).toBe(fn);
  });

  it("should deeply clone nested objects and arrays", function () {
    const obj = { a: 1, b: { c: 2 }, d: [1, [2, 3]] };
    const cloned = cloneDeep(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
    expect(cloned.d).not.toBe(obj.d);
    expect(cloned.d[1]).not.toBe(obj.d[1]);
  });

  it("should clone Date and RegExp preserving lastIndex", function () {
    const date = new Date("2024-01-01");
    const clonedDate = cloneDeep(date);
    expect(clonedDate).not.toBe(date);
    expect(clonedDate.getTime()).toBe(date.getTime());

    const re = /ab/g;
    re.lastIndex = 1;
    const clonedRe = cloneDeep(re);
    expect(clonedRe).not.toBe(re);
    expect(clonedRe.source).toBe("ab");
    expect(clonedRe.flags).toBe("g");
    expect(clonedRe.lastIndex).toBe(1);
  });

  it("should deeply clone Map and Set including keys", function () {
    const key = { k: 1 };
    const map = new Map([[key, { v: 2 }]]);
    const clonedMap = cloneDeep(map);
    expect(clonedMap).not.toBe(map);
    const [clonedKey] = clonedMap.keys();
    expect(clonedKey).not.toBe(key);
    expect(clonedKey).toEqual(key);

    const set = new Set([{ a: 1 }]);
    const clonedSet = cloneDeep(set);
    const [clonedItem] = clonedSet.values();
    expect(clonedSet).not.toBe(set);
    expect(clonedItem).toEqual({ a: 1 });
    expect(clonedItem).not.toBe([...set.values()][0]);
  });

  it("should handle circular references", function () {
    const obj: { a: number; self?: unknown; arr: unknown[] } = {
      a: 1,
      arr: [],
    };
    obj.self = obj;
    obj.arr.push(obj);
    const cloned = cloneDeep(obj);
    expect(cloned.self).toBe(cloned);
    expect(cloned.arr[0]).toBe(cloned);
    expect(cloned).not.toBe(obj);
  });

  it("should preserve shared references as shared in the clone", function () {
    const shared = { s: 1 };
    const obj = { x: shared, y: shared };
    const cloned = cloneDeep(obj);
    expect(cloned.x).toBe(cloned.y);
    expect(cloned.x).not.toBe(shared);

    const date = new Date(0);
    const withDates = { x: date, y: date };
    const clonedDates = cloneDeep(withDates);
    expect(clonedDates.x).toBe(clonedDates.y);
    expect(clonedDates.x).not.toBe(date);
  });

  it("should clone class instances preserving the prototype", function () {
    class Point {
      constructor(public x: number) {}
      double() {
        return this.x * 2;
      }
    }
    const cloned = cloneDeep(new Point(2));
    expect(cloned instanceof Point).toBe(true);
    expect(cloned.x).toBe(2);
    expect(cloned.double()).toBe(4);
  });

  it("should copy enumerable symbol keys", function () {
    const s = Symbol("k");
    const obj = { [s]: { v: 1 }, n: 2 };
    const cloned = cloneDeep(obj);
    expect(cloned[s]).toEqual({ v: 1 });
    expect(cloned[s]).not.toBe(obj[s]);
  });

  it("should preserve a null prototype", function () {
    const obj = Object.create(null) as Record<string, number>;
    obj.x = 1;
    const cloned = cloneDeep(obj);
    expect(Object.getPrototypeOf(cloned)).toBe(null);
    expect(cloned.x).toBe(1);
  });

  it("should clone TypedArray, ArrayBuffer, and DataView", function () {
    const ta = new Int32Array([1, 2, 3]);
    const clonedTa = cloneDeep(ta);
    expect(clonedTa).not.toBe(ta);
    expect(clonedTa).toBeInstanceOf(Int32Array);
    expect([...clonedTa]).toEqual([1, 2, 3]);
    clonedTa[0] = 9;
    expect(ta[0]).toBe(1);

    const buf = new ArrayBuffer(4);
    const clonedBuf = cloneDeep(buf);
    expect(clonedBuf).not.toBe(buf);
    expect(clonedBuf.byteLength).toBe(4);

    const dv = new DataView(new ArrayBuffer(8), 0, 8);
    dv.setInt8(0, 7);
    const clonedDv = cloneDeep(dv);
    expect(clonedDv).not.toBe(dv);
    expect(clonedDv.getInt8(0)).toBe(7);
  });

  it("should return uncloneable exotic objects as-is", function () {
    const wm = new WeakMap();
    const ws = new WeakSet();
    const p = Promise.resolve(1);
    expect(cloneDeep(wm)).toBe(wm);
    expect(cloneDeep(ws)).toBe(ws);
    expect(cloneDeep(p)).toBe(p);
  });
});
