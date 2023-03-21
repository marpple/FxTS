import { groupBy, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

type Data = { id: number; value: string; name: string };

const source: Data[] = [
  { id: 1, value: "a", name: "kim" },
  { id: 2, value: "b", name: "kim" },
  { id: 3, value: "c", name: "lee" },
  { id: 4, value: "d", name: "park" },
];

const res1 = groupBy((a) => a.name, source);
const res2 = pipe(
  source,
  groupBy((a) => a.name),
);

// throw AsyncFunctionException
const res3 = pipe(
  source,
  groupBy((a) => Promise.resolve(a.name)),
);

const res4 = pipe(
  source,
  toAsync,
  groupBy((a) => Promise.resolve(a.name)),
);

checks([
  check<typeof res1, { [p: string]: Data[] }, Test.Pass>(),
  check<typeof res2, { [p: string]: Data[] }, Test.Pass>(),
  check<typeof res3, { [p: string]: Data[] }, Test.Pass>(),
  check<typeof res4, Promise<{ [p: string]: Data[] }>, Test.Pass>(),
]);
