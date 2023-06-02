import { randomInt } from "crypto";

import { isNil, pipe, throwIf } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

interface User {
  name?: string | null;
  age: number;
}

const createUser = (): User => ({ name: null, age: 23 });

const res1 = createUser();
const res2 = pipe(
  createUser(),

  (user) => user.name,

  throwIf<string | null | undefined, null | undefined>(isNil, (name) =>
    Error(`User name is ${typeof name}`),
  ),
);

const res3 = throwIf(
  (list: number[]) => list.includes(0),
  () => new Error("0"),
)([1, 2, 3]);

const res4 = throwIf((list: number[]) => list.includes(0))([1, 2, 3]);

const res5 = pipe(
  [1, 2, 3],

  throwIf((list) => list.includes(0)),
);

const res6 = pipe(
  [1, 2, 3],

  throwIf(
    (list) => list.includes(0),
    () => new Error("0"),
  ),
);

// 1 | 2 | 3
const res7 = pipe(
  randomInt(1, 3) as 1 | 2 | 3,

  throwIf((a): a is 2 => a === 2),
);

// 1 | 2 | 3
const res8 = pipe(
  randomInt(1, 3) as 1 | 2 | 3,

  throwIf<1 | 2 | 3, 2>((a): a is 2 => a === 2),
);

// 1 | 2 | 3
const res9 = pipe(
  ([1, 2, 3] as const)[Math.random()],
  throwIf(
    (a): a is 2 => a === 2,
    () => new Error("0"),
  ),
);

checks([
  check<typeof res1, User, Test.Pass>(),
  check<typeof res2, string, Test.Pass>(),
  check<typeof res3, number[], Test.Pass>(),
  check<typeof res4, number[], Test.Pass>(),
  check<typeof res5, number[], Test.Pass>(),
  check<typeof res6, number[], Test.Pass>(),
  check<typeof res7, 1 | 2 | 3, Test.Pass>(),
  check<typeof res8, 1 | 3, Test.Pass>(),
  check<typeof res9, 1 | 2 | 3, Test.Pass>(),
]);
