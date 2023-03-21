import type IterableInfer from "../../src/types/IterableInfer";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

checks([
  check<IterableInfer<[number]>, number, Test.Pass>(),
  check<IterableInfer<Iterable<number>>, number, Test.Pass>(),
  check<IterableInfer<AsyncIterable<number>>, number, Test.Pass>(),
]);
