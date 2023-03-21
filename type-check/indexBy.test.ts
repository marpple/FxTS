import { indexBy, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

type Data = { id: number; value: string };

const source: Data[] = [
  { id: 1, value: "a" },
  { id: 2, value: "b" },
  { id: 3, value: "c" },
];

const res1 = indexBy((a) => a.id, source);
const res2 = pipe(
  source,
  indexBy((a) => a.id),
);

// throw AsyncFunctionException
const res3 = pipe(
  source,
  indexBy((a) => Promise.resolve(a.id)),
);

const res4 = pipe(
  source,
  toAsync,
  indexBy((a) => Promise.resolve(a.id)),
);

const res5 = indexBy((a) => a.type, [
  { type: "a", value: 1 },
  { type: "b", value: 2 },
  { type: "c", value: 3 },
  { type: "a", value: 4 },
  { type: "b", value: 5 },
  { type: "c", value: 6 },
  { type: "a", value: 7 },
  { type: "b", value: 8 },
  { type: "c", value: 9 },
  { type: "a", value: 10 },
] as { type: "a" | "b" | "c"; value: number }[]);

checks([
  check<typeof res1, { [index: number]: Data }, Test.Pass>(),
  check<typeof res2, { [index: number]: Data }, Test.Pass>(),
  check<typeof res3, { [index: number]: Data }, Test.Pass>(),
  check<typeof res4, Promise<{ [index: number]: Data }>, Test.Pass>(),
  check<
    typeof res5,
    {
      a: {
        type: "a";
        value: number;
      };
      b: {
        type: "b";
        value: number;
      };
      c: {
        type: "c";
        value: number;
      };
    },
    Test.Pass
  >(),
]);
