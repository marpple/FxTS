import { once } from "../src";

describe("once", function () {
  it("should call the function only on the first call and cache the result", function () {
    let count = 0;
    const init = once((a: number) => {
      count += 1;
      return a * 10;
    });
    expect(init(1)).toBe(10);
    expect(init(2)).toBe(10);
    expect(init(3)).toBe(10);
    expect(count).toBe(1);
  });

  it("should cache falsy results as well", function () {
    let count = 0;
    const f = once(() => {
      count += 1;
      return undefined;
    });
    expect(f()).toBe(undefined);
    expect(f()).toBe(undefined);
    expect(count).toBe(1);
  });

  it("should preserve this", function () {
    const obj = {
      value: 42,
      read: once(function (this: { value: number }) {
        return this.value;
      }),
    };
    expect(obj.read()).toBe(42);
  });
});
