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

  throwIf(isNil)((name) => Error(`User name is ${typeof name}`)),
);

checks([
  check<typeof res1, User, Test.Pass>(),
  check<typeof res2, string, Test.Pass>(),
]);
