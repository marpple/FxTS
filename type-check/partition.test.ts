import { partition, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res0 = partition((a) => typeof a === "string", []);
const res1 = partition((a) => a > 3, [0, 1, 2, 3, 4]);

type Res1 = [(string | number)[], (string | number)[]];
const list1 = ["3", "4", "5", 1, 2, 3];
const res2 = partition((a) => typeof a === "number", list1);
const res3: Res1 = pipe(
  list1,
  partition((a) => typeof a === "number"),
);
// throw AsyncFunctionException
const res4: Res1 = pipe(
  list1,
  partition((a) => Promise.resolve(typeof a === "number")),
);
const res5: Promise<Res1> = pipe(
  list1,
  toAsync,
  partition((a) => Promise.resolve(typeof a === "number")),
);

type Res2 = [number[], (string | boolean)[]];
const list2 = ["3", "4", "5", 1, 2, 3, true, false];
const res6 = partition((a): a is number => typeof a === "number", list2);
const res7 = pipe(
  list2,
  partition((a): a is number => typeof a === "number"),
);
const res8 = partition(
  (a): a is number => typeof a === "number",
  toAsync(list2),
);
const res9 = pipe(
  list2,
  toAsync,
  partition((a): a is number => typeof a === "number"),
);

type Res3 = [
  { type: "A"; value: number; value2: boolean }[],
  { type: "B" | "C"; value: number; value2: boolean }[],
];

type Res4 = [
  { type: "A"; value: number; value2: true }[],
  { type: "A" | "B" | "C"; value: number; value2: boolean }[],
];

const list3 = [
  { type: "A", value: 1, value2: false },
  { type: "B", value: 2, value2: true },
  { type: "C", value: 3, value2: false },
  { type: "A", value: 4, value2: true },
] as { type: "A" | "B" | "C"; value: number; value2: boolean }[];

const res10 = partition(
  (a): a is { type: "A"; value: number; value2: boolean } => a.type === "A",
  list3,
);

const res11 = pipe(
  list3,
  partition(
    (a): a is { type: "A"; value: number; value2: boolean } => a.type === "A",
  ),
);

const res12 = partition(
  (a): a is { type: "A"; value: number; value2: boolean } => a.type === "A",
  toAsync(list3),
);

const res13 = pipe(
  list3,
  toAsync,
  partition(
    (a): a is { type: "A"; value: number; value2: boolean } => a.type === "A",
  ),
);

const res14 = partition(
  (a): a is { type: "A"; value: number; value2: true } =>
    a.type === "A" && a.value2,
  list3,
);

const res15 = pipe(
  list3,
  partition(
    (a): a is { type: "A"; value: number; value2: true } =>
      a.type === "A" && a.value2,
  ),
);

const res16 = partition(
  (a): a is { type: "A"; value: number; value2: true } =>
    a.type === "A" && a.value2,
  toAsync(list3),
);

const res17 = pipe(
  list3,
  toAsync,
  partition(
    (a): a is { type: "A"; value: number; value2: true } =>
      a.type === "A" && a.value2,
  ),
);

type Res5 = [
  { type: "A"; value: number; value2: true }[],
  { type: "B" | "C"; value: number; value2: false }[],
];

const list4 = [
  { type: "A", value: 1, value2: true },
  { type: "B", value: 2, value2: true },
  { type: "C", value: 3, value2: false },
  { type: "A", value: 4, value2: true },
] as Array<
  | { type: "A"; value: number; value2: true }
  | { type: "B" | "C"; value: number; value2: false }
>;

const res18 = partition(
  (a): a is { type: "A"; value: number; value2: true } =>
    a.value2 && a.type === "A",
  list4,
);

const res19 = pipe(
  list4,
  partition(
    (a): a is { type: "A"; value: number; value2: true } =>
      a.value2 && a.type === "A",
  ),
);

const res20 = partition(
  (a): a is { type: "A"; value: number; value2: true } =>
    a.value2 && a.type === "A",
  toAsync(list4),
);

const res21 = pipe(
  list4,
  toAsync,
  partition(
    (a): a is { type: "A"; value: number; value2: true } =>
      a.value2 && a.type === "A",
  ),
);

type Res6 = [{ type: true; value: number }[], { type: false; value: number }[]];
const list5 = [
  { type: true, value: 1 },
  { type: false, value: 2 },
  { type: true, value: 3 },
  { type: false, value: 4 },
] as { type: boolean; value: number }[];

const res22 = partition(
  (a): a is { type: true; value: number } => a.type,
  list5,
);

const res23 = pipe(
  list5,
  partition((a): a is { type: true; value: number } => a.type),
);

const res24 = partition(
  (a): a is { type: true; value: number } => a.type,
  toAsync(list5),
);

const res25 = pipe(
  list5,
  toAsync,
  partition((a): a is { type: true; value: number } => a.type),
);

checks([
  check<typeof res0, [never[], never[]], Test.Pass>(),
  check<typeof res1, [number[], number[]], Test.Pass>(),
  check<typeof res2, Res1, Test.Pass>(),
  check<typeof res3, Res1, Test.Pass>(),
  check<typeof res4, Res1, Test.Pass>(),
  check<typeof res5, Promise<Res1>, Test.Pass>(),
  check<typeof res6, Res2, Test.Pass>(),
  check<typeof res7, Res2, Test.Pass>(),
  check<typeof res8, Promise<Res2>, Test.Pass>(),
  check<typeof res9, Promise<Res2>, Test.Pass>(),
  check<typeof res10, Res3, Test.Pass>(),
  check<typeof res11, Res3, Test.Pass>(),
  check<typeof res12, Promise<Res3>, Test.Pass>(),
  check<typeof res13, Promise<Res3>, Test.Pass>(),
  check<typeof res14, Res4, Test.Pass>(),
  check<typeof res15, Res4, Test.Pass>(),
  check<typeof res16, Promise<Res4>, Test.Pass>(),
  check<typeof res17, Promise<Res4>, Test.Pass>(),
  check<typeof res18, Res5, Test.Pass>(),
  check<typeof res19, Res5, Test.Pass>(),
  check<typeof res20, Promise<Res5>, Test.Pass>(),
  check<typeof res21, Promise<Res5>, Test.Pass>(),
  check<typeof res22, Res6, Test.Pass>(),
  check<typeof res23, Res6, Test.Pass>(),
  check<typeof res24, Promise<Res6>, Test.Pass>(),
  check<typeof res25, Promise<Res6>, Test.Pass>(),
]);
