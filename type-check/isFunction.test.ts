import { isFunction } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isFunction(() => 1);
const res2 = isFunction(1);
const res3 = isFunction(null);

function call(input: number | ((a: number) => number)) {
  if (isFunction(input)) {
    return input(1);
  }
  return input;
}

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<ReturnType<typeof call>, number, Test.Pass>(),
]);
