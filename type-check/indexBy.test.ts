import {
  entries,
  fromEntries,
  indexBy,
  map,
  pipe,
  reduce,
  toAsync,
} from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

type Data = { id: number; value: string };

const source: Data[] = [
  { id: 1, value: "a" },
  { id: 2, value: "b" },
  { id: 3, value: "c" },
];

const alphabetList = ["a", "b", "c", "d", "a", "b", "c", "d"] as Array<
  "a" | "b" | "c" | "d"
>;

type NormalAlphabetListResult = { [p: string]: "a" | "b" | "c" | "d" };
type NarrowedAlphabetListResult = { a: "a"; b: "b"; c: "c"; d: "d" };

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

const res6 = indexBy((a) => a, alphabetList);

const res7 = pipe(
  alphabetList,
  indexBy((a) => a),
);

const res8 = indexBy((a) => a, toAsync(alphabetList));
const res9 = pipe(
  alphabetList,
  toAsync,
  indexBy((a) => a),
);

const res10 = indexBy((a) => a + String(Math.random()), alphabetList);

const res11 = pipe(
  alphabetList,
  indexBy((a) => a + String(Math.random())),
);

const res12 = indexBy((a) => a + String(Math.random()), toAsync(alphabetList));
const res13 = pipe(
  alphabetList,
  toAsync,
  indexBy((a) => a + String(Math.random())),
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

const res15 = indexBy((a) => a.value, source2);
const res16 = pipe(
  source2,
  indexBy((a) => a.value),
);
const res17 = indexBy((a) => a.value, toAsync(source2));
const res18 = pipe(
  source2,
  toAsync,
  indexBy((a) => a.value),
);

checks([
  check<typeof res1, { [index: number]: Data }, Test.Pass>(),
  check<typeof res2, { [index: number]: Data }, Test.Pass>(),
  check<typeof res3, { [index: number]: Data }, Test.Pass>(),
  check<typeof res4, Promise<{ [index: number]: Data }>, Test.Pass>(),
  check<
    typeof res5,
    {
      a: { type: "a" | "b" | "c"; value: number };
      b: { type: "a" | "b" | "c"; value: number };
      c: { type: "a" | "b" | "c"; value: number };
    },
    Test.Pass
  >(),
  check<typeof res6, NarrowedAlphabetListResult, Test.Pass>(),
  check<typeof res7, NarrowedAlphabetListResult, Test.Pass>(),
  check<typeof res8, Promise<NarrowedAlphabetListResult>, Test.Pass>(),
  check<typeof res9, Promise<NarrowedAlphabetListResult>, Test.Pass>(),
  check<typeof res10, NormalAlphabetListResult, Test.Pass>(),
  check<typeof res11, NormalAlphabetListResult, Test.Pass>(),
  check<typeof res12, Promise<NormalAlphabetListResult>, Test.Pass>(),
  check<typeof res13, Promise<NormalAlphabetListResult>, Test.Pass>(),
  check<typeof res15, { a: Data2; b: Data2; c: Data2 }, Test.Pass>(),
  check<typeof res16, { a: Data2; b: Data2; c: Data2 }, Test.Pass>(),
  check<typeof res17, Promise<{ a: Data2; b: Data2; c: Data2 }>, Test.Pass>(),
  check<typeof res18, Promise<{ a: Data2; b: Data2; c: Data2 }>, Test.Pass>(),
]);

// ============= New Test Cases for enum and union types =============

// Enum type test
enum UserRole {
  Admin = "admin",
  User = "user",
  Guest = "guest",
}

type UserData = { id: number; name: string; role: UserRole };

const users: UserData[] = [
  { id: 1, name: "Alice", role: UserRole.Admin },
  { id: 2, name: "Bob", role: UserRole.User },
  { id: 3, name: "Charlie", role: UserRole.Guest },
];

const enumTest1 = indexBy((u) => u.role, users);
const enumTest2 = pipe(
  users,
  indexBy((u) => u.role),
);

// String union type test
type Priority = "low" | "medium" | "high";
type TaskData = { id: number; title: string; priority: Priority };

const tasks: TaskData[] = [
  { id: 1, title: "Task 1", priority: "low" },
  { id: 2, title: "Task 2", priority: "high" },
  { id: 3, title: "Task 3", priority: "medium" },
];

const unionTest1 = indexBy((t) => t.priority, tasks);
const unionTest2 = pipe(
  tasks,
  indexBy((t) => t.priority),
);

// Simple Object methods tests
const indexedUsers = indexBy((u) => u.role, users);
const objectKeysTest = Object.keys(indexedUsers);
const objectValuesTest = Object.values(indexedUsers);

// Type checks
checks([
  check<typeof res1, { [index: number]: Data }, Test.Pass>(),
  check<typeof res2, { [index: number]: Data }, Test.Pass>(),
  check<typeof res3, { [index: number]: Data }, Test.Pass>(),
  check<typeof res4, Promise<{ [index: number]: Data }>, Test.Pass>(),
  check<
    typeof res5,
    {
      a: { type: "a" | "b" | "c"; value: number };
      b: { type: "a" | "b" | "c"; value: number };
      c: { type: "a" | "b" | "c"; value: number };
    },
    Test.Pass
  >(),
  check<typeof res6, NarrowedAlphabetListResult, Test.Pass>(),
  check<typeof res7, NarrowedAlphabetListResult, Test.Pass>(),
  check<typeof res8, Promise<NarrowedAlphabetListResult>, Test.Pass>(),
  check<typeof res9, Promise<NarrowedAlphabetListResult>, Test.Pass>(),
  check<typeof res10, NormalAlphabetListResult, Test.Pass>(),
  check<typeof res11, NormalAlphabetListResult, Test.Pass>(),
  check<typeof res12, Promise<NormalAlphabetListResult>, Test.Pass>(),
  check<typeof res13, Promise<NormalAlphabetListResult>, Test.Pass>(),
  check<typeof res15, { a: Data2; b: Data2; c: Data2 }, Test.Pass>(),
  check<typeof res16, { a: Data2; b: Data2; c: Data2 }, Test.Pass>(),
  check<typeof res17, Promise<{ a: Data2; b: Data2; c: Data2 }>, Test.Pass>(),
  check<typeof res18, Promise<{ a: Data2; b: Data2; c: Data2 }>, Test.Pass>(),
  // New enum type tests
  check<typeof enumTest1, { [K in UserRole]: UserData }, Test.Pass>(),
  check<typeof enumTest2, { [K in UserRole]: UserData }, Test.Pass>(),
  // New string union type tests
  check<typeof unionTest1, { [K in Priority]: TaskData }, Test.Pass>(),
  check<typeof unionTest2, { [K in Priority]: TaskData }, Test.Pass>(),
  // Object methods pattern tests (these should pass now!)
  check<typeof objectKeysTest, string[], Test.Pass>(),
  check<typeof objectValuesTest, UserData[], Test.Pass>(),
]);
