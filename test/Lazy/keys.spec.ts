import { keys } from "../../src";

describe("keys", function () {
  it("should return an iterator that iterates keys of the given object", function () {
    const obj = {
      a: 1,
      b: "2",
      c: true,
      d: Symbol("a"),
      e: function () {
        return null;
      },
      f: null,
      g: undefined,
    };
    const iter = keys(obj);
    expect(iter.next().value).toEqual("a");
    const res = [...iter];
    expect(res).toEqual(["b", "c", "d", "e", "f", "g"]);
  });

  it("should only deal with enumerable properties", function () {
    const obj = { a: 1, b: 2, c: 3 };
    Object.defineProperty(obj, "a", {
      enumerable: false,
    });
    Object.defineProperty(obj, "c", {
      enumerable: false,
    });
    const res = [...keys(obj)];
    expect(res).toEqual(["b"]);
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
    const res = [...keys(instance)];
    expect((instance as any).c).toEqual(3);
    expect(res).toEqual(["a", "b"]);
  });
});
