import { filter, isNil, map, pipe, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

type User = {
  name?: string | null;
  age: number;
};

const user: User = {
  age: 23,
};

function getUserName(user: User) {
  if (!isNil(user.name)) {
    return user.name;
  }

  throw new Error("Not exist user's name");
}

const res1 = getUserName(user);
const res2 = pipe([user, user, user], map(getUserName), toArray);

const res3 = pipe(
  [null, undefined, 2, 3, true, "", null],
  filter(isNil),
  toArray,
);

const res4 = pipe([null, 2, 3, true, "", null], filter(isNil), toArray);

const res5 = pipe(
  [undefined, 2, 3, true, "", undefined],
  filter(isNil),
  toArray,
);

const res6 = pipe([2, 3, true, ""], filter(isNil), toArray);

checks([
  check<typeof res1, string, Test.Pass>(),
  check<typeof res2, string[], Test.Pass>(),
  check<typeof res3, (null | undefined)[], Test.Pass>(),
  check<typeof res4, null[], Test.Pass>(),
  check<typeof res5, undefined[], Test.Pass>(),
  check<typeof res6, never[], Test.Pass>(),
]);
