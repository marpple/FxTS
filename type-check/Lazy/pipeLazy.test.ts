import { pipeLazy, throwError } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const res1 = pipeLazy(String)(1);
const res2 = pipeLazy(Number)("1");

const res3 = pipeLazy(async (n: number) => String(n))(Promise.resolve(1));
const res4 = pipeLazy(async (s: string) => Number(s))(Promise.resolve("1"));

const res5 = pipeLazy((a) => Promise.resolve(String(a)))(1);
const res6 = pipeLazy((a) => Promise.resolve(Number(a)))("1");

const res7 = pipeLazy((a) => Promise.resolve(String(a)))(Promise.resolve(1));
const res8 = pipeLazy((a) => Promise.resolve(Number(a)))(Promise.resolve("1"));

const res9 = pipeLazy(
  (a: "a" | "b") => a.toUpperCase(),
  () => 1,
)("a");

const res10 = pipeLazy(
  (a: "a") => a.toUpperCase(),
  async () => 1,
)(Promise.resolve("a" as const));

const res11 = pipeLazy(
  (a: "a") => Promise.resolve(a.toUpperCase()),
  () => 1,
)(Promise.resolve("a" as const));

const res12 = pipeLazy(
  (a: "a") => a.toUpperCase(),
  () => Promise.resolve(1),
)(Promise.resolve("a" as const));

const res13 = pipeLazy(
  (a: "a") => (Math.random() > 0.5 ? a.toUpperCase() : Promise.resolve("hi")),
  () => 1,
)(Promise.resolve("a" as const));

const res14 = pipeLazy(throwError(() => Error()))(0);

const res15 = pipeLazy(
  async () => 1,
  throwError(() => Error()),
)(0);

const res16 = pipeLazy(
  throwError(() => Error()),
  async () => 1,
  () => 2,
)(0);

const res17 = pipeLazy(
  async () => {
    throw Error("");
  },
  throwError(() => Error("")),
  () => 1,
  () => 2,
)(0);

const res18 = pipeLazy((a: number) => String(a))(Promise.resolve(2));

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
  check<typeof res10, Promise<number>, Test.Pass>(),
  check<typeof res11, Promise<number>, Test.Pass>(),
  check<typeof res12, Promise<number>, Test.Pass>(),
  check<typeof res13, Promise<number>, Test.Pass>(),
  check<typeof res14, never, Test.Pass>(),
  check<typeof res15, Promise<never>, Test.Pass>(),
  check<typeof res16, never, Test.Pass>(),
  check<typeof res17, Promise<never>, Test.Pass>(),
  check<typeof res18, Promise<string>, Test.Pass>(),
]);
