import { evolve, pipe } from "../src";

describe("evolve", function () {
  const add1 = (a: number) => a + 1;
  const add1String = (a: number) => String(add1(a));

  it("should return the transformed object", function () {
    const obj = { a: 1, b: 2, c: 3 };
    const transformation = {
      a: add1String,
      b: add1,
      c: add1String,
    };
    const res = evolve(transformation, obj);
    expect(res).toEqual({ a: "2", b: 3, c: "4" });
  });

  it("should apply the `identity` function to a property if there is no matched transform function", function () {
    const obj = { a: 1, b: 2, c: 3 };
    const transformation = {
      b: add1,
    };
    const res = evolve(transformation, obj);
    expect(res).toEqual({ a: 1, b: 3, c: 3 });
  });

  it("should be able to be used as a curried function in the pipeline", function () {
    const obj = { a: 1, b: 2, c: 3 };
    const transformation = {
      a: add1String,
      b: add1,
      c: add1String,
    };
    const res = pipe(obj, evolve(transformation), Object.values);
    expect(res).toEqual(["2", 3, "4"]);
  });

  it("should be handled nested objects", function () {
    const add1String = (a: number) => String(a + 1);
    const obj = { a: 1, b: 2, c: { d: 3, e: 4 }, f: true };
    const transformation = {
      a: add1String,
      b: add1String,
      c: (obj: { d: number; e: number }) =>
        evolve({ d: add1String, e: add1String }, obj),
    };
    const res = evolve(transformation, obj);
    expect(res).toEqual({
      a: "2",
      b: "3",
      c: { d: "4", e: "5" },
      f: true,
    });
  });
});
