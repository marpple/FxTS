import { countBy, pipe, toAsync } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

type Data = { id: number; value: string; name: "kim" | "lee" | "park" };
type Res = { kim: number; lee: number; park: number };

const source: Data[] = [
  { id: 1, value: "a", name: "kim" },
  { id: 2, value: "b", name: "kim" },
  { id: 3, value: "c", name: "lee" },
  { id: 4, value: "d", name: "park" },
];

const res1 = countBy((a) => a.name, source);
const res2 = pipe(
  source,
  countBy((a) => a.name),
);

// throw AsyncFunctionException
const res3 = pipe(
  source,
  countBy((a) => Promise.resolve(a.name)),
);

const res4 = countBy((a) => a.name, toAsync(source));
const res5 = pipe(
  source,
  toAsync,
  countBy((a) => Promise.resolve(a.name)),
);

checks([
  check<typeof res1, Res, Test.Pass>(),
  check<typeof res2, Res, Test.Pass>(),
  check<typeof res3, Res, Test.Pass>(),
  check<typeof res4, Promise<Res>, Test.Pass>(),
  check<typeof res5, Promise<Res>, Test.Pass>(),
]);
