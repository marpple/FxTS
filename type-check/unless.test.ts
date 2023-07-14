import { randomInt } from "crypto";

import { isString, pipe, throwError, unless } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

interface User {
  name?: string | null;
  gender: "female" | "male";
  age: number;
}

const createUser = (): User => ({ name: null, age: 23, gender: "female" });

const res1 = createUser();
const res2 = pipe(
  createUser(),

  (user) => user.name,

  unless(isString, () => 0),
);

const res3 = pipe(
  randomInt(1, 4),

  unless(
    (val: number) => val > 2,
    () => {
      return;
    },
  ),
);

const res4 = pipe(
  randomInt(1, 4),

  unless(
    (val: number) => val > 2,
    throwError(() => Error("")),
  ),
);

const res5 = pipe(
  randomInt(1, 4) as 1 | 2 | 3,

  unless(
    (num: 1 | 2 | 3): num is 3 => num > 2,
    (num) => {
      return `${num}` as const;
    },
  ),
);

const res6 = pipe(
  createUser(),
  unless(
    (user): user is User & { gender: "female" } => user.gender === "female",
    throwError(() => Error("")),
  ),
);

checks([
  check<typeof res1, User, Test.Pass>(),
  check<typeof res2, string | number, Test.Pass>(),
  check<typeof res3, number | undefined, Test.Pass>(),
  check<typeof res4, number, Test.Pass>(),
  check<typeof res5, "1" | "2" | 3, Test.Pass>(),
  check<typeof res6, User & { gender: "female" }, Test.Pass>(),
]);
