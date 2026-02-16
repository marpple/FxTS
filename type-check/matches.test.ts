import { filter, find, matches, pipe, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

type User = {
  name: string;
  age: number;
  active: boolean;
};

const users: User[] = [
  { name: "John", age: 30, active: true },
  { name: "Jane", age: 25, active: false },
  { name: "Bob", age: 30, active: true },
];

const res1 = matches({ age: 30 });
const res2 = matches({ age: 30, active: true });
const res3 = matches({});

const res4 = res1({ name: "John", age: 30, active: true });
const res5 = res1(null);
const res6 = res1(undefined);

const res7 = filter(matches({ age: 30 }), users);
const res8 = find(matches({ active: true }), users);

const res9 = pipe(users, filter(matches({ age: 30 })), toArray);
const res10 = pipe(users, find(matches({ name: "John" })));

type NestedUser = {
  id: number;
  profile: {
    name: string;
    age: number;
  };
};

const nestedUsers: NestedUser[] = [
  { id: 1, profile: { name: "John", age: 30 } },
  { id: 2, profile: { name: "Jane", age: 25 } },
];

const res11 = filter(matches({ profile: { age: 30 } }), nestedUsers);
const res12 = find(matches({ profile: { name: "John" } }), nestedUsers);

checks([
  check<typeof res1, (input: unknown) => boolean, Test.Pass>(),
  check<typeof res2, (input: unknown) => boolean, Test.Pass>(),
  check<typeof res3, (input: unknown) => boolean, Test.Pass>(),
  check<typeof res4, boolean, Test.Pass>(),
  check<typeof res5, boolean, Test.Pass>(),
  check<typeof res6, boolean, Test.Pass>(),
  check<typeof res7, IterableIterator<User>, Test.Pass>(),
  check<typeof res8, User | undefined, Test.Pass>(),
  check<typeof res9, User[], Test.Pass>(),
  check<typeof res10, User | undefined, Test.Pass>(),
  check<typeof res11, IterableIterator<NestedUser>, Test.Pass>(),
  check<typeof res12, NestedUser | undefined, Test.Pass>(),
]);
