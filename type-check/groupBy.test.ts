import {
  entries,
  fromEntries,
  groupBy,
  map,
  pipe,
  reduce,
  toAsync,
} from "../src";
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

// Type narrowing is no longer applied, so the type is simpler
type Res5To8 = {
  a: { type: "a" | "b" | "c"; value: number }[];
  b: { type: "a" | "b" | "c"; value: number }[];
  c: { type: "a" | "b" | "c"; value: number }[];
};

type NarrowedAlphabetListResult = { a: "a"[]; b: "b"[]; c: "c"[] };
type NormalAlphabetListResult = { [p: string]: ("a" | "b" | "c")[] };

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
);

const res13 = groupBy((a) => a + String(Math.random()), list2);

const res14 = pipe(
  list2,
  groupBy((a) => a + String(Math.random())),
);

const res15 = groupBy((a) => a + String(Math.random()), toAsync(list2));
const res16 = pipe(
  list2,
  toAsync,
  groupBy((a) => a + String(Math.random())),
);

type Data2 = {
  id: number;
  value: "a" | "b" | "c";
  name: "a" | "b" | "c";
};

const source2: Data2[] = [
  { id: 1, value: "a", name: "c" },
  { id: 2, value: "b", name: "c" },
  { id: 3, value: "c", name: "b" },
  { id: 4, value: "c", name: "a" },
];

const res17 = groupBy((a) => a.value, source2);
const res18 = pipe(
  source2,
  groupBy((a) => a.value),
);
const res19 = groupBy((a) => a.value, toAsync(source2));
const res20 = pipe(
  source2,
  toAsync,
  groupBy((a) => a.value),
);

// ============= New Test Cases for Issue #233 =============

// Enum type test
enum Status {
  Todo = "TODO",
  InProgress = "IN_PROGRESS",
  Done = "DONE",
}

type TaskData = { id: number; status: Status; priority: number };

const tasks: TaskData[] = [
  { id: 1, status: Status.Todo, priority: 1 },
  { id: 2, status: Status.InProgress, priority: 2 },
  { id: 3, status: Status.Done, priority: 3 },
];

const enumTest1 = groupBy((t) => t.status, tasks);
const enumTest2 = pipe(
  tasks,
  groupBy((t) => t.status),
);

// String union type test
type Color = "red" | "green" | "blue";
type ColorData = { name: string; color: Color; value: number };

const colors: ColorData[] = [
  { name: "apple", color: "red", value: 1 },
  { name: "grass", color: "green", value: 2 },
  { name: "sky", color: "blue", value: 3 },
];

const unionTest1 = groupBy((c) => c.color, colors);
const unionTest2 = pipe(
  colors,
  groupBy((c) => c.color),
);

// The critical entries + reduce pattern from issue #233
const entriesReduceTest = pipe(
  tasks,
  groupBy((t) => t.status),
  entries,
  map(
    ([status, items]) =>
      [status, reduce((sum, item) => sum + item.priority, 0, items)] as const,
  ),
  fromEntries,
);

// Type checks
checks([
  check<typeof res1, { [p: string]: Data[] }, Test.Pass>(),
  check<typeof res2, { [p: string]: Data[] }, Test.Pass>(),
  check<typeof res3, { [p: string]: Data[] }, Test.Pass>(),
  check<typeof res4, Promise<{ [p: string]: Data[] }>, Test.Pass>(),
  check<typeof res5, Res5To8, Test.Pass>(),
  check<typeof res6, Res5To8, Test.Pass>(),
  check<typeof res7, Promise<Res5To8>, Test.Pass>(),
  check<typeof res8, Promise<Res5To8>, Test.Pass>(),
  check<typeof res9, NarrowedAlphabetListResult, Test.Pass>(),
  check<typeof res10, NarrowedAlphabetListResult, Test.Pass>(),
  check<typeof res11, Promise<NarrowedAlphabetListResult>, Test.Pass>(),
  check<typeof res12, Promise<NarrowedAlphabetListResult>, Test.Pass>(),
  check<typeof res13, NormalAlphabetListResult, Test.Pass>(),
  check<typeof res14, NormalAlphabetListResult, Test.Pass>(),
  check<typeof res15, Promise<NormalAlphabetListResult>, Test.Pass>(),
  check<typeof res16, Promise<NormalAlphabetListResult>, Test.Pass>(),
  check<typeof res17, { a: Data2[]; b: Data2[]; c: Data2[] }, Test.Pass>(),
  check<typeof res18, { a: Data2[]; b: Data2[]; c: Data2[] }, Test.Pass>(),
  check<
    typeof res19,
    Promise<{ a: Data2[]; b: Data2[]; c: Data2[] }>,
    Test.Pass
  >(),
  check<
    typeof res20,
    Promise<{ a: Data2[]; b: Data2[]; c: Data2[] }>,
    Test.Pass
  >(),
  // New enum type tests
  check<typeof enumTest1, { [K in Status]: TaskData[] }, Test.Pass>(),
  check<typeof enumTest2, { [K in Status]: TaskData[] }, Test.Pass>(),
  // New string union type tests
  check<typeof unionTest1, { [K in Color]: ColorData[] }, Test.Pass>(),
  check<typeof unionTest2, { [K in Color]: ColorData[] }, Test.Pass>(),
  // Entries + reduce pattern test (this should pass now!)
  check<typeof entriesReduceTest, { [K in Status]: number }, Test.Pass>(),
]);
