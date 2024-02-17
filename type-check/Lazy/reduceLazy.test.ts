import { pipe, toAsync } from "../../src";
import reduceLazy from "../../src/Lazy/reduceLazy";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

const homoSyncFn = reduceLazy((acc: number, value: number) => acc + value);
const homoSyncFnIterable = homoSyncFn([1, 2, 3]);
const homoSyncFnAsyncIterable = homoSyncFn(toAsync([1, 2, 3]));

const homoAsyncFn = reduceLazy(
  async (acc: number, value: number) => acc + value,
);
const homoAsyncFnIterable = homoAsyncFn([1, 2, 3]);
const homoAsyncFnAsyncIterable = homoAsyncFn(toAsync([1, 2, 3]));

const heteroSyncFn = reduceLazy(
  (acc: number, value: string) => acc + Number(value),
  0,
);
const heteroSyncFnIterable = heteroSyncFn(["1", "2", "3"]);
const heteroSyncFnAsyncIterable = heteroSyncFn(toAsync(["1", "2", "3"]));

const heteroAsyncFn = reduceLazy(
  async (acc: number, value: string) => acc + Number(value),
  0,
);
const heteroAsyncFnIterable = heteroAsyncFn(["1", "2", "3"]);
const heteroAsyncFnAsyncIterable = heteroAsyncFn(toAsync(["1", "2", "3"]));

const homoPipe = pipe(
  [1, 2, 3],
  reduceLazy((acc, value) => acc + value),
);
const heteroPipe = pipe(
  ["1", "2", "3"],
  reduceLazy((acc, value) => acc + Number(value), 0),
);
const homoPipeAsync = pipe(
  [1, 2, 3],
  toAsync,
  reduceLazy((acc, value) => acc + value),
);
const heteroPipeAsync = pipe(
  ["1", "2", "3"],
  toAsync,
  reduceLazy((acc, value) => acc + Number(value), 0),
);
const homoPipeAsyncPromise = pipe(
  [1, 2, 3],
  toAsync,
  reduceLazy(async (acc, value) => acc + value),
);
const heteroPipePromise = pipe(
  ["1", "2", "3"],
  toAsync,
  reduceLazy(async (acc, value) => acc + Number(value), 0),
);

checks([
  check<typeof homoSyncFnIterable, number, Test.Pass>(),
  check<typeof homoSyncFnAsyncIterable, Promise<number>, Test.Pass>(),
  check<typeof homoAsyncFnIterable, Promise<number>, Test.Pass>(),
  check<typeof homoAsyncFnAsyncIterable, Promise<number>, Test.Pass>(),
  check<typeof heteroSyncFnIterable, number, Test.Pass>(),
  check<typeof heteroSyncFnAsyncIterable, Promise<number>, Test.Pass>(),
  check<typeof heteroAsyncFnIterable, Promise<number>, Test.Pass>(),
  check<typeof heteroAsyncFnAsyncIterable, Promise<number>, Test.Pass>(),
  check<typeof homoPipe, number, Test.Pass>(),
  check<typeof heteroPipe, number, Test.Pass>(),
  check<typeof homoPipeAsync, Promise<number>, Test.Pass>(),
  check<typeof heteroPipeAsync, Promise<number>, Test.Pass>(),
  check<typeof homoPipeAsyncPromise, Promise<number>, Test.Pass>(),
  check<typeof heteroPipePromise, Promise<number>, Test.Pass>(),
]);
