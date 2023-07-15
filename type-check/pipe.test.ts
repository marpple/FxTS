import { pipe, throwError } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = pipe(1, String);
const res2 = pipe("1", Number);

const res3 = pipe(Promise.resolve(1), String);
const res4 = pipe(Promise.resolve("1"), Number);

const res5 = pipe(1, (a) => Promise.resolve(String(a)));
const res6 = pipe("1", (a) => Promise.resolve(Number(a)));

const res7 = pipe(Promise.resolve(1), (a) => Promise.resolve(String(a)));
const res8 = pipe(Promise.resolve("1"), (a) => Promise.resolve(Number(a)));

const res9 = pipe(
  "a" as "a" | "b",
  (a) => a.toUpperCase(),
  () => 1,
);

const res10 = pipe(
  Promise.resolve("a") as Promise<"a"> | "a",
  (a) => a.toUpperCase(),
  () => 1,
);

const res11 = pipe(
  Promise.resolve("a") as Promise<"a"> | "a",
  (a) => Promise.resolve(a.toUpperCase()),
  () => 1,
);

const res12 = pipe(
  Promise.resolve("a") as Promise<"a"> | "a",
  (a) => a.toUpperCase(),
  () => Promise.resolve(1),
);

const res13 = pipe(
  Promise.resolve("a") as Promise<"a"> | "a",
  (a) => (Math.random() > 0.5 ? a.toUpperCase() : Promise.resolve("hi")),
  () => 1,
);

const res14 = pipe(
  0,
  throwError(() => Error()),
);

const res15 = pipe(
  0,
  async () => 1,
  throwError(() => Error()),
);

const res16 = pipe(
  0,
  throwError(() => Error()),
  async () => 1,
  () => 2,
);

const res17 = pipe(
  0,
  async () => {
    throw Error("");
  },
  throwError(() => Error("")),
  () => 1,
  () => 2,
);

checks([
  check<typeof res1, string, Test.Pass>(),
  check<typeof res2, number, Test.Pass>(),
  check<typeof res3, Promise<string>, Test.Pass>(),
  check<typeof res4, Promise<number>, Test.Pass>(),
  check<typeof res5, Promise<string>, Test.Pass>(),
  check<typeof res6, Promise<number>, Test.Pass>(),
  check<typeof res7, Promise<string>, Test.Pass>(),
  check<typeof res8, Promise<number>, Test.Pass>(),
  check<typeof res9, number, Test.Pass>(),
  check<typeof res10, number | Promise<number>, Test.Pass>(),
  check<typeof res11, Promise<number>, Test.Pass>(),
  check<typeof res12, Promise<number>, Test.Pass>(),
  check<typeof res13, number | Promise<number>, Test.Pass>(),
  check<typeof res14, never, Test.Pass>(),
  check<typeof res15, Promise<never>, Test.Pass>(),
  check<typeof res16, never, Test.Pass>(),
  check<typeof res17, Promise<never>, Test.Pass>(),
]);
