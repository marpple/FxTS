import { isNil, isString, pipe, reject, toAsync } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = reject((a) => a % 2 === 0, [1, 2, 3]);
const res2 = reject(async (a) => a % 2 === 0, [1, 2, 3]);
const res3 = reject((a) => a % 2 === 0, toAsync([1, 2, 3]));
const res4 = reject(async (a) => a % 2 === 0, toAsync([1, 2, 3]));

const res5 = pipe(
  [1, 2, 3, 4],
  reject((a) => a % 2 === 0),
);
const res6 = pipe(
  [1, 2, 3, 4],
  reject(async (a) => a % 2 === 0),
);
const res7 = pipe(
  toAsync([1, 2, 3, 4]),
  reject((a) => a % 2 === 0),
);
const res8 = pipe(
  toAsync([1, 2, 3, 4]),
  reject(async (a) => a % 2 === 0),
);

const res9 = reject(isNil, [1, 2, 3, "4", "5", "6", null, undefined]);
const res10 = reject(isNil, toAsync([1, 2, 3, "4", "5", "6", null, undefined]));
const res11 = pipe(
  [1, 2, 3, "4", "5", "6", null, undefined],
  reject(isNil),
  reject(isString),
);
const res12 = pipe(
  [1, 2, 3, "4", "5", "6", null, undefined],
  toAsync,
  reject(isNil),
  reject(isString),
);

type Res1 = { type: "B" | "C"; value: number; value2: boolean };
type Res2 = { type: "A" | "B" | "C"; value: number; value2: boolean };

const list1 = [
  { type: "A", value: 1, value2: false },
  { type: "B", value: 2, value2: true },
  { type: "C", value: 3, value2: false },
  { type: "A", value: 4, value2: true },
] as { type: "A" | "B" | "C"; value: number; value2: boolean }[];

const res13 = reject(
  (a): a is { type: "A"; value: number; value2: boolean } => a.type === "A",
  list1,
);

const res14 = pipe(
  list1,
  reject(
    (a): a is { type: "A"; value: number; value2: boolean } => a.type === "A",
  ),
);

const res15 = reject(
  (a): a is { type: "A"; value: number; value2: boolean } => a.type === "A",
  toAsync(list1),
);

const res16 = pipe(
  list1,
  toAsync,
  reject(
    (a): a is { type: "A"; value: number; value2: boolean } => a.type === "A",
  ),
);

const res17 = reject(
  (a): a is { type: "A"; value: number; value2: true } =>
    a.type === "A" && a.value2,
  list1,
);

const res18 = pipe(
  list1,
  reject(
    (a): a is { type: "A"; value: number; value2: true } =>
      a.type === "A" && a.value2,
  ),
);

const res19 = reject(
  (a): a is { type: "A"; value: number; value2: true } =>
    a.type === "A" && a.value2,
  toAsync(list1),
);

const res20 = pipe(
  list1,
  toAsync,
  reject(
    (a): a is { type: "A"; value: number; value2: true } =>
      a.type === "A" && a.value2,
  ),
);

type Res3 = { type: "B" | "C"; value: number; value2: false };

const list2 = [
  { type: "A", value: 1, value2: true },
  { type: "B", value: 2, value2: true },
  { type: "C", value: 3, value2: false },
  { type: "A", value: 4, value2: true },
] as Array<
  | { type: "A"; value: number; value2: true }
  | { type: "B" | "C"; value: number; value2: false }
>;

const res21 = reject(
  (a): a is { type: "A"; value: number; value2: true } =>
    a.value2 && a.type === "A",
  list2,
);

const res22 = pipe(
  list2,
  reject(
    (a): a is { type: "A"; value: number; value2: true } =>
      a.value2 && a.type === "A",
  ),
);

const res23 = reject(
  (a): a is { type: "A"; value: number; value2: true } =>
    a.value2 && a.type === "A",
  toAsync(list2),
);

const res24 = pipe(
  list2,
  toAsync,
  reject(
    (a): a is { type: "A"; value: number; value2: true } =>
      a.value2 && a.type === "A",
  ),
);

type Res4 = { type: false; value: number };
const list3 = [
  { type: true, value: 1 },
  { type: false, value: 2 },
  { type: true, value: 3 },
  { type: false, value: 4 },
] as { type: boolean; value: number }[];

const res25 = reject((a): a is { type: true; value: number } => a.type, list3);

const res26 = pipe(
  list3,
  reject((a): a is { type: true; value: number } => a.type),
);

const res27 = reject(
  (a): a is { type: true; value: number } => a.type,
  toAsync(list3),
);

const res28 = pipe(
  list3,
  toAsync,
  reject((a): a is { type: true; value: number } => a.type),
);

checks([
  check<typeof res1, IterableIterator<number>, Test.Pass>(),
  check<typeof res2, IterableIterator<number>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res5, IterableIterator<number>, Test.Pass>(),
  check<typeof res6, IterableIterator<number>, Test.Pass>(),
  check<typeof res7, AsyncIterableIterator<number>, Test.Pass>(),
  check<typeof res8, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res9, IterableIterator<number | string>, Test.Pass>(),
  check<typeof res10, AsyncIterableIterator<number | string>, Test.Pass>(),
  check<typeof res11, IterableIterator<number>, Test.Pass>(),
  check<typeof res12, AsyncIterableIterator<number>, Test.Pass>(),

  check<typeof res13, IterableIterator<Res1>, Test.Pass>(),
  check<typeof res14, IterableIterator<Res1>, Test.Pass>(),
  check<typeof res15, AsyncIterableIterator<Res1>, Test.Pass>(),
  check<typeof res16, AsyncIterableIterator<Res1>, Test.Pass>(),
  check<typeof res17, IterableIterator<Res2>, Test.Pass>(),
  check<typeof res18, IterableIterator<Res2>, Test.Pass>(),
  check<typeof res19, AsyncIterableIterator<Res2>, Test.Pass>(),
  check<typeof res20, AsyncIterableIterator<Res2>, Test.Pass>(),
  check<typeof res21, IterableIterator<Res3>, Test.Pass>(),
  check<typeof res22, IterableIterator<Res3>, Test.Pass>(),
  check<typeof res23, AsyncIterableIterator<Res3>, Test.Pass>(),
  check<typeof res24, AsyncIterableIterator<Res3>, Test.Pass>(),
  check<typeof res25, IterableIterator<Res4>, Test.Pass>(),
  check<typeof res26, IterableIterator<Res4>, Test.Pass>(),
  check<typeof res27, AsyncIterableIterator<Res4>, Test.Pass>(),
  check<typeof res28, AsyncIterableIterator<Res4>, Test.Pass>(),
]);
