import { evolve, pipe } from "../src/index";

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
});
