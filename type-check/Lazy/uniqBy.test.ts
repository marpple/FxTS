import * as Test from "../../src/types/Test";
import { toAsync, uniqBy, pipe } from "../../src";

const { checks, check } = Test;

const res1 = uniqBy((a) => a, ["m", "r", "r"]);
const res2 = uniqBy(async (a) => a, ["m", "r", "r"]);
const res3 = uniqBy((a) => a, toAsync(["m", "r", "r"]));
const res4 = uniqBy(async (a) => a, toAsync(["m", "r", "r"]));

const res5 = pipe(
  ["m", "r", "r"],
  uniqBy((a) => a),
);
const res6 = pipe(
  ["m", "r", "r"],
  uniqBy(async (a) => a),
);
const res7 = pipe(
  toAsync(["m", "r", "r"]),
  uniqBy((a) => a),
);
const res8 = pipe(
  toAsync(["m", "r", "r"]),
  uniqBy(async (a) => a),
);

checks([
  check<typeof res1, IterableIterator<string>, Test.Pass>(),
  check<typeof res2, IterableIterator<string>, Test.Pass>(), // prettier-ignore
  check<typeof res3, AsyncIterableIterator<string>, Test.Pass>(),
  check<typeof res4, AsyncIterableIterator<string>, Test.Pass>(),

  check<typeof res5, IterableIterator<string>, Test.Pass>(),
  check<typeof res6, IterableIterator<string>, Test.Pass>(), // prettier-ignore
  check<typeof res7, AsyncIterableIterator<string>, Test.Pass>(),
  check<typeof res8, AsyncIterableIterator<string>, Test.Pass>(),
]);
