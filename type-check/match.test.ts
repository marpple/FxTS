import {
  isNumber,
  isString,
  map,
  match,
  pipe,
  throwError,
  toArray,
} from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = pipe(
  ["hello", 42, true],
  map(
    match(
      isString,
      (s) => `String: ${s}`,
      isNumber,
      (n) => `Number: ${n}`,
      () => "Unknown type",
    ),
  ),
  toArray,
);

const res2 = pipe(
  ["hello", 42, true],
  map(
    match(
      isString,
      (s) => `String: ${s}`,
      isNumber,
      (n) => `Number: ${n}`,
      throwError((input) => Error(`Unknown type: ${input}`)),
    ),
  ),
  toArray,
);

const res3 = pipe(
  ["hello", 42],
  map(
    match<string | number, string | number, string, number>(
      isString,
      (s) => `String: ${s}`,
      isNumber,
      (n) => `Number: ${n}`,
    ),
  ),
  toArray,
);

interface A {
  id: number;
  type: "A";
}

const _as: A[] = [
  { id: 1, type: "A" },
  { id: 2, type: "A" },
  { id: 3, type: "A" },
  { id: 4, type: "A" },
  { id: 5, type: "A" },
  { id: 6, type: "A" },
] as const;

const narrowA =
  <T extends number>(id: T) =>
  (a: A): a is A & { id: T } =>
    a.id === id;

const getId = <T extends number>(a: A): T => a.id as T;

const res4 = pipe(
  _as,
  map(
    match(
      narrowA(1),
      getId<1>,
      narrowA(2),
      getId<2>,
      narrowA(3),
      getId<3>,
      narrowA(4),
      getId<4>,
      narrowA(5),
      getId<5>,
      match(
        narrowA(6),
        getId<6>,
        throwError((a) => Error(`Unknown id: ${a.id}`)),
      ),
    ),
  ),
  toArray,
);

checks([
  check<typeof res1, string[], Test.Pass>(),
  check<typeof res2, string[], Test.Pass>(),
  check<typeof res3, (string | number)[], Test.Pass>(),
  check<typeof res4, (1 | 2 | 3 | 4 | 5 | 6)[], Test.Pass>(),
]);
