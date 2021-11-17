import * as Test from "../../src/types/Test";
import { toAsync, flatMap, pipe } from "../../src";

const { checks, check } = Test;

const res1 = flatMap((s) => s.split(" "), ["It is", "a good", "day"]);
const res2 = flatMap(async (s) => s.split(" "), ["It is", "a good", "day"]);
const res3 = flatMap((s) => s.split(" "), toAsync(["It is", "a good", "day"]));
const res4 = flatMap(
  async (s) => s.split(" "),
  toAsync(["It is", "a good", "day"]),
);

const res5 = pipe(
  ["It is", "a good", "day"],
  flatMap((s) => s.split(" ")),
);
const res6 = pipe(
  ["It is", "a good", "day"],
  flatMap(async (s) => s.split(" ")),
);
const res7 = pipe(
  toAsync(["It is", "a good", "day"]),
  flatMap(async (s) => s.split(" ")),
);

checks([
  check<typeof res1, IterableIterator<string>, Test.Pass>(),
  check<typeof res2, IterableIterator<Promise<string[]>>, Test.Pass>(),
  check<typeof res3, AsyncIterableIterator<string>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<string>, Test.Pass>(),

  check<typeof res5, IterableIterator<string>, Test.Pass>(),
  check<typeof res6, IterableIterator<Promise<string[]>>, Test.Pass>(), // prettier-ignore
  check<typeof res7, AsyncIterableIterator<string>, Test.Pass>(), // prettier-ignore
]);
