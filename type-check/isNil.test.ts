import { isNil, map, pipe, toArray } from "../src";
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

checks([
  check<typeof res1, string, Test.Pass>(),
  check<typeof res2, string[], Test.Pass>(),
]);
