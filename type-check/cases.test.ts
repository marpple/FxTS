import { cases, lt, map, pipe, throwError, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = pipe(
  [10, 20, 30],
  map(
    cases(
      lt(15),
      (n) => `less than 15: ${n}`,
      lt(25),
      (n) => `less than 25: ${n}`,
      (n) => `greater than or equal to 25: ${n}`,
    ),
  ),
  toArray,
);

const res2 = pipe(
  [
    { type: "A", a: "asd" },
    { type: "B", b: true },
    { type: "C", c: 123 },
  ],
  map(
    cases(
      (a): a is { type: "A"; a: string } => a.type === "A",
      (n) => `Type A: ${n.a}`,
      (a) => a.type === "B",
      (n) => `Type B: ${n.b}`,
      throwError((input) => Error(`Unknown type: ${JSON.stringify(input)}`)),
    ),
  ),
  toArray,
);

type A = { a: string };
type B = A & { b: string };

const res3 = pipe(
  [{ a: "A", b: "B" }, { a: "A" }] as A[],
  map(
    cases(
      (n): n is B => "b" in n,
      (n) => n.b,
      (n) => n.a,
    ),
  ),
  toArray,
);

checks([
  check<typeof res1, string[], Test.Pass>(),
  check<typeof res2, string[], Test.Pass>(),
  check<typeof res3, string[], Test.Pass>(),
]);
