import * as Test from "../src/types/Test";
import { indexBy, pipe, toAsync } from "../src";

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

checks([
  check<typeof res1, { [index: number]: Data }, Test.Pass>(),
  check<typeof res2, { [index: number]: Data }, Test.Pass>(),
  check<typeof res3, { [index: number]: Data }, Test.Pass>(),
  check<typeof res4, Promise<{ [index: number]: Data }>, Test.Pass>(),
]);
