import { isUndefined, map, negate, pipe, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const isDefined = negate(isUndefined);

type User = {
  name?: string;
  age: number;
};

const user: User = {
  age: 23,
};

const getUserName = (user: User): string => {
  if (isDefined(user.name)) return user.name;
  throw Error("Not exist user's name");
};

const res1 = getUserName(user);
const res2 = pipe([user, user, user], map(getUserName), toArray);

checks([
  check<typeof res1, string, Test.Pass>(),
  check<typeof res2, string[], Test.Pass>(),
]);
