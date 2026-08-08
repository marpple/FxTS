import { isPlainObject } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isPlainObject({});
const res2 = isPlainObject([1, 2, 3]);
const res3 = isPlainObject(null);

function getValue(input: unknown) {
  if (isPlainObject(input)) {
    return input;
  }
  return undefined;
}

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<
    ReturnType<typeof getValue>,
    Record<PropertyKey, unknown> | undefined,
    Test.Pass
  >(),
]);
