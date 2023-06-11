import { randomInt } from "crypto";

import { isNil, pipe, throwIfNot } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

interface User {
  name: string | null;
  gender: "female" | "male";
  age: number;
}

const createUser = (): User => ({ name: null, age: 23, gender: "female" });

const res1 = createUser();
const res2 = pipe(
  createUser(),
  (user) => user.name,
  throwIfNot(isNil, (name) => Error(`User name is ${name}`)),
);

const res3 = throwIfNot(
  (list: number[]) => list.includes(0),
  () => new Error("0"),
)([1, 2, 3]);

const res4 = throwIfNot((list: number[]) => list.includes(0))([1, 2, 3]);

const res5 = pipe(
  [1, 2, 3],
  throwIfNot((list) => list.includes(0)),
);

const res6 = pipe(
  [1, 2, 3],
  throwIfNot(
    (list) => list.includes(0),
    () => new Error("0"),
  ),
);

const res7 = pipe(
  randomInt(1, 4) as 1 | 2 | 3,
  throwIfNot((a): a is 2 => a === 2),
);

const res8 = pipe(
  randomInt(1, 4) as 1 | 2 | 3,
  throwIfNot(
    (a): a is 2 => a === 2,
    () => new Error(),
  ),
);

const res9 = pipe(
  { age: 10 } as User,

  throwIfNot(
    (user): user is User & { gender: "female" } => user.gender === "female",
  ),
);

checks([
  check<typeof res1, User, Test.Pass>(),
  check<typeof res2, null, Test.Pass>(),
  check<typeof res3, number[], Test.Pass>(),
  check<typeof res4, number[], Test.Pass>(),
  check<typeof res5, number[], Test.Pass>(),
  check<typeof res6, number[], Test.Pass>(),
  check<typeof res7, 2, Test.Pass>(),
  check<typeof res8, 2, Test.Pass>(),
  check<typeof res9, User & { gender: "female" }, Test.Pass>(),
]);
