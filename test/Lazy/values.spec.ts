import { values } from "../../src";

describe("values", function () {
  it("should return an iterator that iterates values of the given object's property", function () {
    const obj = {
      a: 1,
      b: "2",
      c: true,
      d: null,
      e: undefined,
    };
    const iter = values(obj);
    expect(iter.next().value).toEqual(1);
    const res = [...iter];
    expect(res).toEqual(["2", true, null, undefined]);
  });

  it("should only deal with enumerable properties", function () {
    const obj = { a: 1, b: 2, c: 3 };
    Object.defineProperty(obj, "a", {
      enumerable: false,
    });
    Object.defineProperty(obj, "c", {
      enumerable: false,
    });
    const res = [...values(obj)];
    expect(res).toEqual([2]);
  });

  it("should only deal with its own properties", function () {
    class Parent {
      a = 1;
    }
    class Child extends Parent {
      b = 2;
    }
    const instance = new Child();
    const proto = Object.getPrototypeOf(instance);
    proto.__proto__.c = 3;
    const res = [...values(instance)];
    expect((instance as any).c).toEqual(3);
    expect(res).toEqual([1, 2]);
  });
});
