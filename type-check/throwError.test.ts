import { isNumber, isString, pipe, skip, throwError } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = throwError(() => Error(""))(1);
const res2 = pipe(
  0,

  throwError(() => Error("")),
);

const res3 = pipe(
  0,

  skip(
    isNumber,
    throwError(() => Error("")),
  ),
);

const res4 = pipe(
  0,

  skip(
    isString,
    throwError(() => Error("")),
  ),
);

checks([
  check<typeof res1, never, Test.Pass>(),
  check<typeof res2, never, Test.Pass>(),
  check<typeof res3, number, Test.Pass>(),
  check<typeof res4, number, Test.Pass>(),
]);
