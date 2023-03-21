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

type Res9To12 = { a: "a"[]; b: "b"[]; c: "c"[] };

const list1 = [
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
const res5 = groupBy((a) => a.type, list1);

const res6 = pipe(
  list1,
  groupBy((a) => a.type),
); // Res
const res7 = groupBy((a) => a.type, toAsync(list1)); // Promise<Res>
const res8 = pipe(
  list1,
  toAsync,
  groupBy((a) => a.type),
); // Promise<Res>

const list2 = ["a", "b", "c", "a", "b", "c"] as Array<"a" | "b" | "c">;

const res9 = groupBy((a) => a, list2); // Res
const res10 = pipe(
  list2,
  groupBy((a) => a),
); // Res

const res11 = groupBy((a) => a, toAsync(list2)); // Promise<Res>
const res12 = pipe(
  list2,
  toAsync,
  groupBy((a) => a),
); // Promise<Res>

checks([
  check<typeof res1, { [p: string]: Data[] }, Test.Pass>(),
  check<typeof res2, { [p: string]: Data[] }, Test.Pass>(),
  check<typeof res3, { [p: string]: Data[] }, Test.Pass>(),
  check<typeof res4, Promise<{ [p: string]: Data[] }>, Test.Pass>(),
  check<typeof res5, Res5To8, Test.Pass>(),
  check<typeof res6, Res5To8, Test.Pass>(),
  check<typeof res7, Promise<Res5To8>, Test.Pass>(),
  check<typeof res8, Promise<Res5To8>, Test.Pass>(),
  check<typeof res9, Res9To12, Test.Pass>(),
  check<typeof res10, Res9To12, Test.Pass>(),
  check<typeof res11, Promise<Res9To12>, Test.Pass>(),
  check<typeof res12, Promise<Res9To12>, Test.Pass>(),
]);
