import { isArray, negate, pipe, prop, throwIf } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isArray([1, 2, 3]);
const res2 = isArray("a");

const res3 = pipe(
  [1, 2, 3] as const,

  throwIf(negate(isArray)),
);

const res4 = pipe(
  [1, 2, 3],

  throwIf(negate(isArray)),
);

type Profile = {
  thumbnail: string;
  nickname?: string;
  id: string;
};

type UserState = {
  profiles: Profile[];
};

declare const state: UserState;

const res5 = pipe(prop("profiles", state), throwIf(negate(isArray)));

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, readonly [1, 2, 3], Test.Pass>(),
  check<typeof res4, number[], Test.Pass>(),

  // this type test prove #317 issue is resolved
  // isArray type guard infer generic type `T` to `Profile[]` type instead of `unknown[]` type
  check<typeof res5, Profile[], Test.Pass>(),
]);
