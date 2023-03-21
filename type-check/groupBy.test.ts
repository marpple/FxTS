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

const list = [
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
] as { type: "a" | "b" | "c"; value: number }[];
const res5 = groupBy((a) => a.type, list);

const res6 = pipe(
  list,
  groupBy((a) => a.type),
); // Res
const res7 = groupBy((a) => a.type, toAsync(list)); // Promise<Res>
const res8 = pipe(
  list,
  toAsync,
  groupBy((a) => a.type),
); // Promise<Res>

type Res5To8 = {
  a: {
    type: "a";
    value: number;
  }[];
  b: {
    type: "b";
    value: number;
  }[];
  c: {
    type: "c";
    value: number;
  }[];
};

checks([
  check<typeof res1, { [p: string]: Data[] }, Test.Pass>(),
  check<typeof res2, { [p: string]: Data[] }, Test.Pass>(),
  check<typeof res3, { [p: string]: Data[] }, Test.Pass>(),
  check<typeof res4, Promise<{ [p: string]: Data[] }>, Test.Pass>(),
  check<typeof res5, Res5To8, Test.Pass>(),
  check<typeof res6, Res5To8, Test.Pass>(),
  check<typeof res7, Promise<Res5To8>, Test.Pass>(),
  check<typeof res8, Promise<Res5To8>, Test.Pass>(),
]);
