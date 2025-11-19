import {
  add,
  always,
  cases,
  gt,
  isString,
  lt,
  map,
  pipe,
  toArray,
} from "../src";

describe("cases", function () {
  it("should work in pipe", function () {
    const res = pipe(
      [10, 20, 30],
      map(cases(gt(15), add(20), gt(25), add(10))),
      toArray,
    );
    expect(res).toEqual([30, 30, 30]);
  });

  it("should work with type guards", function () {
    type A = { a: string };
    type B = A & { b: string };
    const res = pipe(
      [{ a: "A", b: "B" }, { a: "A" }],
      map(
        cases(
          (n): n is B => "b" in n,
          (n) => n.b,
          (n) => n.a,
        ),
      ),
      toArray,
    );
    expect(res).toEqual(["B", "A"]);

    const upper = cases(
      isString,
      (s) => s.toUpperCase(),
      () => "not string",
    );
    expect(upper("hello")).toBe("HELLO");
    expect(upper(123)).toBe("not string");
  });

  it("should match first predicate", function () {
    const res = pipe([5, -5], map(cases(lt(0), always("positive"))), toArray);
    expect(res).toEqual(["positive", -5]);
  });
});
